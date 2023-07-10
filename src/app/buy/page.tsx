'use client'

import { Database } from "@/lib/database.types"
import { Button, Container, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

export default function BuyPage() {
  const supabase = createClientComponentClient<Database>()
  const [items, setItems] = useState<Database['public']['Tables']['helbreath_items']['Row'][] | null>([])

  useEffect(() => {
    const getItems = async () => {
      const { data: items, error } = await supabase.from('helbreath_items').select('*')
      setItems(items)
    }
    getItems()
  }, [supabase])


  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Typography variant="h4" mt={2} mb={4}>What would you like to buy?</Typography>
      <DataGrid
        rows={items || []}
        columns={[
          { field: 'id', headerName: 'ID', width: 100 },
          { field: 'name', headerName: 'Name', width: 200 },
          { field: 'first_attribute_name', headerName: 'First Attribute Name', width: 200 },
          { field: 'first_attribute_value', headerName: 'First Attribute Value', width: 200 },
          { field: 'second_attribute_name', headerName: 'Second Attribute Name', width: 200 },
          { field: 'second_attribute_value', headerName: 'Second Attribute Value', width: 200 },
        ]}
        pageSizeOptions={[10, 50, 100, 250]}
        columnVisibilityModel={{
          id: false,
        }}
        disableRowSelectionOnClick
      />
    </Container>
  )
}