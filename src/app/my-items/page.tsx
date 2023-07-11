'use client'

import { Item } from "@/components/types/Item.types";
import { useEffect, useState } from "react";
import useSupabase from "../hooks/useSupabase";
import useSession from "../hooks/useSession";
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";

type ObjectBooleanValueStringKey = {
  [key: string]: boolean
}
export default function MyItems() {
  const supabase = useSupabase()
  const { user } = useSession()
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteLoading, setDeleteLoading] = useState<ObjectBooleanValueStringKey>({})
  const [items, setItems] = useState<Item[] | null>([])
  const [itemIdToEdit, setItemIdToEdit] = useState<number | null>(null)
  const [newPrice, setNewPrice] = useState<number | null>(null)
  const [editLoading, setEditLoading] = useState<boolean>(false)

  useEffect(() => {
    const getItems = async () => {
      const { data: items } = await supabase.from('helbreath_items').select('*, profiles(discord_id)').eq('user_id', user.id)
      setItems(items)
      setLoading(false)
    }
    if (!user) return;
    getItems()
  }, [user, supabase])

  const handleDeleteItem = (id: number) => async () => {
    setDeleteLoading({ [id]: true });
    const { error } = await supabase.from('helbreath_items').delete().eq('id', id)
    setDeleteLoading({ [id]: false });
    if (error) return
    setItems(items?.filter(item => item.id !== id) || [])
  }

  const openEditPriceDialog = (id: number) => {
    console.log('wkemfwkefm')
    setItemIdToEdit(id);
  }

  const handleEditItemPrice = async () => {
    setEditLoading(true)
    const { error } = await supabase.from('helbreath_items').update({ price: newPrice }).eq('id', itemIdToEdit)
    setEditLoading(false)
    if (error) return
    setItems(items?.map(item => item.id === itemIdToEdit ? { ...item, price: newPrice } : item) || [])
    setItemIdToEdit(null)
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Stack width="100%" alignItems="center">
          <CircularProgress />
        </Stack>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Typography variant="h4" mt={2} mb={4}>Your items</Typography>
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
              renderCell: (row) => (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openEditPriceDialog(row.row.id)}
                  >
                    Edit
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="error"
                    onClick={handleDeleteItem(row.row.id)}
                    loading={deleteLoading[row.row.id]}
                  >
                    Delete
                  </LoadingButton>
                </Stack>
              )
            },
          ]}
          pageSizeOptions={[10, 50, 100, 250]}
          columnVisibilityModel={{
            id: false,
          }}
          disableRowSelectionOnClick
        />
      ) : (
        <Typography variant="h5">You don&apos;t have items to sell. Click <Link href="/sell">here</Link> to post your first item.</Typography>
      )}
      <Dialog
        open={Boolean(itemIdToEdit)}
        onClose={() => setItemIdToEdit(null)}
      >
        <DialogTitle>Edit price</DialogTitle>
        <DialogContent>
          <TextField
            label="New price"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemIdToEdit(null)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handleEditItemPrice}
            loading={editLoading}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  )
}