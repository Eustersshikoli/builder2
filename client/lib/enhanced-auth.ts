import { supabase } from "./supabase";
import { dualDb } from "./dual-database";
import { sql } from "./neon";
import bcrypt from "bcryptjs";

export interface EnhancedUserData {
  fullName?: string;
  username?: string;
  countryCode?: string;
  country?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  occupation?: string;
  experienceLevel?: string;
}

export interface AdminCredentials {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role?: "admin" | "super_admin" | "moderator";
}

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

class EnhancedAuthService {
  private useNeon: boolean = false;

  constructor() {
    const shouldUseNeon = import.meta.env.VITE_USE_NEON === "true";
    const neonAvailable = sql !== null;

    if (shouldUseNeon && !neonAvailable) {
      console.warn(
        "Neon authentication requested but not available, falling back to Supabase",
      );
      this.useNeon = false;
    } else {
      this.useNeon = shouldUseNeon && neonAvailable;
    }
  }

  setUseNeon(useNeon: boolean) {
    if (useNeon && !sql) {
      console.warn("Cannot switch to Neon: database not configured");
      return false;
    }
    this.useNeon = useNeon;
    return dualDb.setUseNeon(useNeon);
  }

  getActiveDatabase() {
    return this.useNeon ? "Neon" : "Supabase";
  }

  // =====================================================
  // ENHANCED USER REGISTRATION
  // =====================================================

  async enhancedSignUp(
    email: string,
    password: string,
    userData: EnhancedUserData,
  ) {
    try {
      let authResult;
      let userId: string;

      if (this.useNeon) {
        if (!sql) {
          throw new Error("Neon database not configured");
        }

        // Create user in Neon's auth_users table
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await sql`
          INSERT INTO auth_users (email, encrypted_password, email_confirmed_at, confirmed_at)
          VALUES (${email}, ${hashedPassword}, NOW(), NOW())
          RETURNING id, email
        `;

        if (!result[0]) {
          throw new Error("Failed to create user in Neon database");
        }

        authResult = { user: result[0], error: null };
        userId = result[0].id;
      } else {
        // Use Supabase auth
        authResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (authResult.error || !authResult.data.user) {
          return authResult;
        }

        userId = authResult.data.user.id;
      }

      // Create enhanced user profile in the chosen database
      const profileData = {
        id: userId,
        email: email,
        full_name: userData.fullName,
        username: userData.username,
        phone_number: userData.phoneNumber,
        country: userData.country,
        country_code: userData.countryCode,
        date_of_birth: userData.dateOfBirth,
        address: userData.address,
        city: userData.city,
        postal_code: userData.postalCode,
        occupation: userData.occupation,
        experience_level: userData.experienceLevel,
        is_verified: false,
      };

      let profile = null;
      try {
        profile = await dualDb.createUserProfile(profileData);
      } catch (profileError) {
        console.error("Failed to create user profile:", {
          message: profileError instanceof Error ? profileError.message : "Unknown error",
          code: profileError && typeof profileError === 'object' && 'code' in profileError ? profileError.code : "NO_CODE",
          details: profileError && typeof profileError === 'object' && 'details' in profileError ? profileError.details : "No details",
          user_id: userId,
        });
        // Don't throw here - user signup should succeed even if profile creation fails
      }

      if (!profile) {
        console.warn(
          "Failed to create user profile, but auth user was created",
        );
      }

      // Create initial balance
      try {
        await dualDb.createUserBalance({
          user_id: userId,
          balance: 0,
          currency: "USD",
        });
      } catch (balanceError) {
        console.error("Failed to create user balance:", {
          message: balanceError instanceof Error ? balanceError.message : "Unknown error",
          code: balanceError && typeof balanceError === 'object' && 'code' in balanceError ? balanceError.code : "NO_CODE",
          details: balanceError && typeof balanceError === 'object' && 'details' in balanceError ? balanceError.details : "No details",
          user_id: userId,
        });
        // Don't throw here - user signup should succeed even if balance creation fails
      }

      return {
        user: authResult.user || authResult.data?.user,
        error: authResult.error,
        profile,
      };
    } catch (error) {
      console.error("Enhanced signup error:", {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : "Unknown error",
        email,
      });

      return {
        user: null,
        error: {
          message:
            error instanceof Error ? error.message : "Registration failed",
        },
        profile: null,
      };
    }
  }

  // =====================================================
  // ENHANCED USER SIGN IN
  // =====================================================

  async enhancedSignIn(email: string, password: string) {
    try {
      if (this.useNeon) {
        if (!sql) {
          throw new Error("Neon database not configured");
        }

        // Authenticate against Neon
        const result = await sql`
          SELECT id, email, encrypted_password
          FROM auth_users
          WHERE email = ${email} AND deleted_at IS NULL
        `;

        if (!result[0]) {
          return {
            user: null,
            error: { message: "Invalid email or password" },
          };
        }

        const user = result[0];
        const isValid = await bcrypt.compare(password, user.encrypted_password);

        if (!isValid) {
          return {
            user: null,
            error: { message: "Invalid email or password" },
          };
        }

        // Update last sign in
        await sql`
          UPDATE auth_users 
          SET last_sign_in_at = NOW(), updated_at = NOW()
          WHERE id = ${user.id}
        `;

        return {
          user: { id: user.id, email: user.email },
          error: null,
        };
      } else {
        // Use Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        return { user: data.user, error };
      }
    } catch (error) {
      console.error("Enhanced signin error:", {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : "Unknown error",
        email,
      });

      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : "Sign in failed",
        },
      };
    }
  }

  // =====================================================
  // ADMIN AUTHENTICATION
  // =====================================================

  async createAdminUser(credentials: AdminCredentials) {
    try {
      const hashedPassword = await bcrypt.hash(credentials.password, 10);

      if (this.useNeon) {
        // Create admin in Neon
        const authResult = await sql`
          INSERT INTO auth_users (email, encrypted_password, email_confirmed_at, confirmed_at)
          VALUES (${credentials.email}, ${hashedPassword}, NOW(), NOW())
          ON CONFLICT (email) DO UPDATE SET 
            encrypted_password = ${hashedPassword},
            updated_at = NOW()
          RETURNING id, email
        `;

        if (!authResult[0]) {
          throw new Error("Failed to create auth user");
        }

        // Create admin profile
        await sql`
          INSERT INTO admin_users (username, email, password_hash, full_name, role)
          VALUES (
            ${credentials.username}, 
            ${credentials.email}, 
            ${hashedPassword}, 
            ${credentials.full_name || credentials.username}, 
            ${credentials.role || "admin"}
          )
          ON CONFLICT (email) DO UPDATE SET 
            password_hash = ${hashedPassword},
            full_name = ${credentials.full_name || credentials.username},
            role = ${credentials.role || "admin"},
            updated_at = NOW()
          RETURNING *
        `;

        // Also create user profile for consistency
        await dualDb.createUserProfile({
          id: authResult[0].id,
          email: credentials.email,
          full_name: credentials.full_name || credentials.username,
          username: credentials.username,
          is_verified: true,
        });
      } else {
        // Create in Supabase (just create profile, auth might be manual)
        const { data: authData, error: authError } = await supabase.auth.signUp(
          {
            email: credentials.email,
            password: credentials.password,
          },
        );

        if (authError && !authData.user) {
          // Try to get existing user
          const { data: existingUser } = await supabase.auth.signInWithPassword(
            {
              email: credentials.email,
              password: credentials.password,
            },
          );

          if (existingUser.user) {
            await dualDb.createUserProfile({
              id: existingUser.user.id,
              email: credentials.email,
              full_name: credentials.full_name || credentials.username,
              username: credentials.username,
              is_verified: true,
            });
          }
        } else if (authData.user) {
          await dualDb.createUserProfile({
            id: authData.user.id,
            email: credentials.email,
            full_name: credentials.full_name || credentials.username,
            username: credentials.username,
            is_verified: true,
          });
        }
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error creating admin user:", {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : "Unknown error",
        email: credentials.email,
      });

      return {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Failed to create admin user",
        },
      };
    }
  }

  async verifyAdminCredentials(email: string, password: string) {
    try {
      if (this.useNeon) {
        // Check admin in Neon
        const result = await sql`
          SELECT au.id, au.email, au.encrypted_password, adu.username, adu.full_name, adu.role, adu.is_active
          FROM auth_users au
          JOIN admin_users adu ON au.email = adu.email
          WHERE au.email = ${email} AND adu.is_active = true AND au.deleted_at IS NULL
        `;

        if (!result[0]) {
          return {
            user: null,
            error: { message: "Invalid admin credentials" },
          };
        }

        const admin = result[0];
        const isValid = await bcrypt.compare(
          password,
          admin.encrypted_password,
        );

        if (!isValid) {
          return {
            user: null,
            error: { message: "Invalid admin credentials" },
          };
        }

        // Update last login
        await sql`
          UPDATE admin_users 
          SET last_login = NOW(), updated_at = NOW()
          WHERE email = ${email}
        `;

        return {
          user: {
            id: admin.id,
            email: admin.email,
            username: admin.username,
            full_name: admin.full_name,
            role: admin.role,
          },
          error: null,
        };
      } else {
        // Use Supabase and check if user is admin
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          return {
            user: null,
            error: error || { message: "Invalid credentials" },
          };
        }

        // Check if user has admin privileges (you can customize this logic)
        const adminEmails = [
          "admin@forextraderssignals.com",
          "demo@forextraderssignals.com",
          "admin@forexsignals.com",
          "reno@forexsignals.com",
        ];

        if (!adminEmails.includes(data.user.email || "")) {
          await supabase.auth.signOut();
          return {
            user: null,
            error: { message: "Access denied. Admin credentials required." },
          };
        }

        return { user: data.user, error: null };
      }
    } catch (error) {
      console.error("Admin verification error:", {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : "Unknown error",
        email,
      });

      return {
        user: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Admin verification failed",
        },
      };
    }
  }

  // =====================================================
  // DEMO ADMIN SETUP
  // =====================================================

  async setupDemoAdminCredentials() {
    try {
      const demoCredentials = [
        {
          username: import.meta.env.VITE_ADMIN_USERNAME || "admin",
          email:
            import.meta.env.VITE_ADMIN_EMAIL || "admin@forextraderssignals.com",
          password: import.meta.env.VITE_ADMIN_PASSWORD || "Demo@2024!",
          full_name:
            import.meta.env.VITE_ADMIN_FULL_NAME || "Demo Administrator",
          role: "admin" as const,
        },
        {
          username: import.meta.env.VITE_DEMO_USERNAME || "demo",
          email:
            import.meta.env.VITE_DEMO_EMAIL || "demo@forextraderssignals.com",
          password: import.meta.env.VITE_DEMO_PASSWORD || "Demo@2024!",
          full_name: import.meta.env.VITE_DEMO_FULL_NAME || "Demo User",
          role: "admin" as const,
        },
      ];

      const results = [];
      for (const creds of demoCredentials) {
        const result = await this.createAdminUser(creds);
        results.push(result);
      }

      const allSuccessful = results.every((r) => r.success);
      return {
        success: allSuccessful,
        results,
        message: allSuccessful
          ? "Demo credentials set up successfully"
          : "Some demo credentials failed to set up",
      };
    } catch (error) {
      console.error("Error setting up demo credentials:", {
        database: this.getActiveDatabase(),
        message: error instanceof Error ? error.message : "Unknown error",
      });

      return {
        success: false,
        results: [],
        message:
          error instanceof Error
            ? error.message
            : "Failed to set up demo credentials",
      };
    }
  }

  // =====================================================
  // USERNAME VALIDATION
  // =====================================================

  async validateUsername(
    username: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    try {
      const existingUser = await dualDb.getUserByUsername(username);

      if (!existingUser) {
        return true; // Username is available
      }

      // If we're excluding a user ID (for updates), check if it's the same user
      if (excludeUserId && existingUser.id === excludeUserId) {
        return true;
      }

      return false; // Username is taken
    } catch (error) {
      console.error("Error validating username:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        username: username.substring(0, 10) + "...",
      });
      return false; // Assume taken on error
    }
  }

  async validateEmail(email: string, excludeUserId?: string): Promise<boolean> {
    try {
      const existingUser = await dualDb.getUserByEmail(email);

      if (!existingUser) {
        return true; // Email is available
      }

      // If we're excluding a user ID (for updates), check if it's the same user
      if (excludeUserId && existingUser.id === excludeUserId) {
        return true;
      }

      return false; // Email is taken
    } catch (error) {
      console.error("Error validating email:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        email,
      });
      return false; // Assume taken on error
    }
  }

  // =====================================================
  // TELEGRAM AUTHENTICATION
  // =====================================================

  async authenticateWithTelegram(
    authData: TelegramAuthData,
    action: "login" | "register" = "login",
  ) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/telegram-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ authData, action }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          user: null,
          error: { message: result.error || "Telegram authentication failed" },
          requiresRegistration: result.requiresRegistration,
          telegramData: result.telegramData,
        };
      }

      return {
        user: result.user,
        error: null,
        action: result.action,
      };
    } catch (error) {
      console.error("Telegram authentication error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        user: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Telegram authentication failed",
        },
      };
    }
  }

  async initiateTelegramAuth(): Promise<string> {
    const botUsername =
      import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "Blakehunterfxbot";
    const domain = window.location.hostname;
    const telegramUrl = `https://t.me/${botUsername}?start=auth_${domain}`;

    return telegramUrl;
  }

  async linkTelegramAccount(userId: string, telegramData: TelegramAuthData) {
    try {
      if (this.useNeon) {
        if (!sql) {
          throw new Error("Neon database not configured");
        }

        await sql`
          UPDATE user_profiles
          SET
            telegram_id = ${telegramData.id.toString()},
            telegram_username = ${telegramData.username || null},
            telegram_first_name = ${telegramData.first_name},
            telegram_last_name = ${telegramData.last_name || null},
            telegram_photo_url = ${telegramData.photo_url || null},
            updated_at = NOW()
          WHERE id = ${userId}
        `;
      } else {
        await dualDb.updateUserProfile(userId, {
          telegram_id: telegramData.id.toString(),
          telegram_username: telegramData.username,
          telegram_first_name: telegramData.first_name,
          telegram_last_name: telegramData.last_name,
          telegram_photo_url: telegramData.photo_url,
        });
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error linking Telegram account:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        telegramId: telegramData.id,
      });

      return {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Failed to link Telegram account",
        },
      };
    }
  }
}

// Export singleton instance
export const enhancedAuth = new EnhancedAuthService();
