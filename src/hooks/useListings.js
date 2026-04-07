import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useListings(filters = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          listing_images (url, is_primary, order)
        `, { count: 'exact' })
        .eq('status', 'active')

      if (filters.vehicle_type) query = query.eq('vehicle_type', filters.vehicle_type)
      if (filters.brand) query = query.eq('brand', filters.brand)
      if (filters.model) query = query.ilike('model', `%${filters.model}%`)
      if (filters.year_from) query = query.gte('year', filters.year_from)
      if (filters.year_to) query = query.lte('year', filters.year_to)
      if (filters.price_from) query = query.gte('price', filters.price_from)
      if (filters.price_to) query = query.lte('price', filters.price_to)
      if (filters.county) query = query.eq('county', filters.county)
      if (filters.condition?.length) query = query.in('condition', filters.condition)
      if (filters.mileage_to) query = query.lte('mileage_km', filters.mileage_to)

      const sortMap = {
        newest: { column: 'created_at', ascending: false },
        oldest: { column: 'created_at', ascending: true },
        price_asc: { column: 'price', ascending: true },
        price_desc: { column: 'price', ascending: false },
        mileage_asc: { column: 'mileage_km', ascending: true },
      }
      const sort = sortMap[filters.sort] || sortMap.newest
      query = query.order(sort.column, { ascending: sort.ascending })

      const limit = filters.limit || 20
      const page = filters.page || 0
      query = query.range(page * limit, (page + 1) * limit - 1)

      const { data, error, count } = await query
      if (error) throw error
      setListings(data || [])
      setTotal(count || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetchListings() }, [fetchListings])

  return { listings, loading, error, total, refetch: fetchListings }
}
