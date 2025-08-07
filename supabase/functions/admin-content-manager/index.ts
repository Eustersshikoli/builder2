import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContentRequest {
  action: 'create' | 'update' | 'delete' | 'list'
  content_type: 'blog' | 'news' | 'ebook' | 'testimonial' | 'review'
  data?: any
  id?: string
  filters?: any
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return new Response('Forbidden', { 
        status: 403, 
        headers: corsHeaders 
      })
    }

    const requestData: ContentRequest = await req.json()
    const { action, content_type, data, id, filters } = requestData

    let result

    switch (action) {
      case 'create':
        result = await createContent(supabaseClient, content_type, data, user.id)
        break
      case 'update':
        result = await updateContent(supabaseClient, content_type, id!, data)
        break
      case 'delete':
        result = await deleteContent(supabaseClient, content_type, id!)
        break
      case 'list':
        result = await listContent(supabaseClient, content_type, filters)
        break
      default:
        return new Response('Invalid action', { 
          status: 400, 
          headers: corsHeaders 
        })
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Admin content manager error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function createContent(supabaseClient: any, contentType: string, data: any, userId: string) {
  const tables = {
    blog: 'blog_posts',
    news: 'news',
    ebook: 'ebooks',
    testimonial: 'testimonials',
    review: 'reviews'
  }

  const table = tables[contentType as keyof typeof tables]
  if (!table) {
    throw new Error('Invalid content type')
  }

  // Add author/user ID and default values
  const insertData = {
    ...data,
    ...(contentType === 'blog' || contentType === 'news' ? { author_id: userId } : {}),
    ...(contentType === 'testimonial' || contentType === 'review' ? { user_id: userId } : {}),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Generate slug for blog posts
  if (contentType === 'blog' && data.title) {
    insertData.slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const { data: result, error } = await supabaseClient
    .from(table)
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create ${contentType}: ${error.message}`)
  }

  return { success: true, data: result }
}

async function updateContent(supabaseClient: any, contentType: string, id: string, data: any) {
  const tables = {
    blog: 'blog_posts',
    news: 'news',
    ebook: 'ebooks',
    testimonial: 'testimonials',
    review: 'reviews'
  }

  const table = tables[contentType as keyof typeof tables]
  if (!table) {
    throw new Error('Invalid content type')
  }

  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  // Update slug for blog posts if title changed
  if (contentType === 'blog' && data.title) {
    updateData.slug = data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const { data: result, error } = await supabaseClient
    .from(table)
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update ${contentType}: ${error.message}`)
  }

  return { success: true, data: result }
}

async function deleteContent(supabaseClient: any, contentType: string, id: string) {
  const tables = {
    blog: 'blog_posts',
    news: 'news',
    ebook: 'ebooks',
    testimonial: 'testimonials',
    review: 'reviews'
  }

  const table = tables[contentType as keyof typeof tables]
  if (!table) {
    throw new Error('Invalid content type')
  }

  const { error } = await supabaseClient
    .from(table)
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete ${contentType}: ${error.message}`)
  }

  return { success: true, message: `${contentType} deleted successfully` }
}

async function listContent(supabaseClient: any, contentType: string, filters: any = {}) {
  const tables = {
    blog: 'blog_posts',
    news: 'news',
    ebook: 'ebooks',
    testimonial: 'testimonials',
    review: 'reviews'
  }

  const table = tables[contentType as keyof typeof tables]
  if (!table) {
    throw new Error('Invalid content type')
  }

  let query = supabaseClient.from(table).select('*')

  // Apply filters
  if (filters.is_published !== undefined) {
    query = query.eq('is_published', filters.is_published)
  }
  if (filters.is_approved !== undefined) {
    query = query.eq('is_approved', filters.is_approved)
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }

  // Apply pagination
  const page = filters.page || 1
  const limit = filters.limit || 10
  const offset = (page - 1) * limit

  query = query.range(offset, offset + limit - 1)

  // Apply ordering
  const orderBy = filters.order_by || 'created_at'
  const orderDirection = filters.order_direction || 'desc'
  query = query.order(orderBy, { ascending: orderDirection === 'asc' })

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch ${contentType}: ${error.message}`)
  }

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil((count || 0) / limit)
    }
  }
}
