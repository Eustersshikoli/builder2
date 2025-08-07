import PlaceholderPage from "@/components/PlaceholderPage";

export default function Dashboard() {
  return (
    <PlaceholderPage
      title="User Dashboard"
      description="Your personal trading dashboard with account balance, ROI stats, crypto investment tools, signal feed, and referral tracking. Full access requires authentication."
      features={[
        "Account balance & ROI stats",
        "Crypto investment form",
        "QR codes & wallet addresses", 
        "Investment history table",
        "Live signal feed",
        "Referral system",
        "Telegram user benefits",
        "Portfolio tracking"
      ]}
    />
  );
}
