'use client'

import { Item } from "@/components/types/Item.types"
import { Database } from "@/lib/database.types"
import { Button, CircularProgress, Container, Stack, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function BuyPage() {
  const supabase = createClientComponentClient<Database>()
  const [items, setItems] = useState<Item[] | null>(null)

  useEffect(() => {
    const getItems = async () => {
      const { data: items } = await supabase.from('helbreath_items').select('*, profiles(discord_id)')
      setItems(items)
    }
    getItems()
  }, [supabase])

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      {!items ? (
        <Stack width="100%" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Typography variant="h4" mt={2}>What would you like to buy?</Typography>
          <Typography gutterBottom mb={4}>Prices are in Olympia Coins</Typography>
          {items && items.length > 0 ? (
            <DataGrid
              loading={!items}
              rows={items || []}
              columns={[
                { field: 'id', headerName: 'ID', width: 100 },
                { field: 'name', headerName: 'Name', width: 300 },
                { field: 'gender', headerName: 'Gender', width: 60 },
                { field: 'first_attribute_name', headerName: 'First Attribute', width: 150 },
                { field: 'first_attribute_value', headerName: 'Value', width: 60 },
                { field: 'second_attribute_name', headerName: 'Second Attribute', width: 150 },
                { field: 'second_attribute_value', headerName: 'Value', width: 60 },
                { field: 'type', headerName: 'Type', width: 150 },
                { field: 'sub_type', headerName: 'Sub type', width: 150 },
                { field: 'price', headerName: 'Price', width: 100 },
                {
                  field: 'actions',
                  headerName: 'Actions',
                  width: 200,
                  renderCell: (row) => {
                    return (
                      <Link href={`https://discordapp.com/users/${row.row.profiles?.discord_id}`} target="_blank" rel="noopener noreferrer">
                        <Typography>Message seller</Typography>
                      </Link>
                    )
                  }
                },
              ]}
              pageSizeOptions={[10, 50, 100, 250]}
              columnVisibilityModel={{
                id: false,
              }}
              disableRowSelectionOnClick
            />
          ) : (
            <Typography variant="h5">No items being sold at the moment.</Typography>
          )}
        </>
      )}
    </Container>
  )
}