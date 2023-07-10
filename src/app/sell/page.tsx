'use client';

import SignInDialog from "@/components/auth/SignInDialog";
import SignUpDialog from "@/components/auth/SignUpDialog";
import { Database } from "@/lib/database.types";
import { LoadingButton } from "@mui/lab";
import { Button, CircularProgress, Container, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Stack, TextField, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import _ from "lodash";

import { useEffect, useState } from "react";

const BASE_ITEM = {
  name: '',
  firstAttributeName: '',
  firstAttributeValue: '',
  secondAttributeName: '',
  secondAttributeValue: '',
  image_url: null,
  gender: '',
}

export default function SellPage() {
  const supabase = createClientComponentClient<Database>()

  const [user, setUser] = useState<null | any>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [createResolved, setCreateResolved] = useState({
    success: false,
    error: false,
    loading: false,
  });
  const [signUpDialogOpen, setSignUpDialogOpen] = useState<boolean>(false)
  const [signInDialogOpen, setSignInDialogOpen] = useState<boolean>(false)
  const [itemData, setItemData] = useState(BASE_ITEM)

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setUserLoading(false)
    }
    getSession()
  }, [supabase])

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemData({
      ...itemData,
      [event.target.name]: event.target.value
    })
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    setItemData({
      ...itemData,
      [event.target.name]: event.target.value
    })
  };

  const openSignUpDialog = () => {
    setSignUpDialogOpen(true)
  }

  const closeSignUpDialog = () => {
    setSignUpDialogOpen(false)
  }

  const openSignInDialog = () => {
    setSignInDialogOpen(true)
  }

  const closeSignInDialog = () => {
    setSignInDialogOpen(false)
  }

  const handleCreateItem = async () => {
    console.log('create item')
    const mandatoryFields = [
      'name',
      'firstAttributeName',
      'firstAttributeValue',
      'secondAttributeName',
      'secondAttributeValue',
      'gender',
    ]
    const missingFields = mandatoryFields.filter((field) => !itemData[field])
    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(', ')}`)
      return
    }

    try {
      setCreateResolved((oldValue) => ({ ...oldValue, loading: true }));
      const snakeCaseItem = _.mapKeys(itemData, (_value, key) => _.snakeCase(key))
      await supabase.from('helbreath_items').insert({ ...snakeCaseItem, user_id: user.id })
      setCreateResolved((oldValue) => ({ ...oldValue, success: true }));
      setItemData(BASE_ITEM)
    } catch {
      setCreateResolved((oldValue) => ({ ...oldValue, error: true }));
    } finally {
      setCreateResolved((oldValue) => ({ ...oldValue, loading: false }));
    }
  }

  if (userLoading) {
    return (
      <Stack height="50vh" alignItems="center" justifyContent="center">
        <CircularProgress size={40} />
      </Stack>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Typography variant="h4" textAlign="center" mb={2}>You must be logged in to sell an item.</Typography>
        <Stack alignItems="center">
          <Stack direction="row" alignItems="center" justifyContent="center" columnGap={4} width={{ xs: '100%', sm: '80%', md: '50%' }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={openSignUpDialog}
            >
              Sign up
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={openSignInDialog}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
        <SignUpDialog open={signUpDialogOpen} onClose={closeSignUpDialog} />
        <SignInDialog open={signInDialogOpen} onClose={closeSignInDialog} />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>What would you like to sell?</Typography>
          {createResolved.error && (
            <Typography variant="body1" color="error" sx={(theme) => ({ color: theme.palette.error.main })}>
              There was an error creating your item. Please try again.
            </Typography>
          )}
          {createResolved.success && (
            <Typography variant="body1" sx={(theme) => ({ color: theme.palette.success.main })}>
              Your item was created successfully.
            </Typography>
          )}
        </Grid>
        <Grid item xs={10} sm={6}>
          <TextField
            fullWidth
            label="Item name"
            variant="outlined"
            value={itemData.name}
            name="name"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="select-gender-label">Gender</InputLabel>
            <Select
              labelId="select-gender-label"
              id="select-gender"
              value={itemData.gender}
              label="Gender"
              name="gender"
              onChange={handleSelectChange}
            >
              <MenuItem value="W">W</MenuItem>
              <MenuItem value="M">M</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4} />
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="first-attribute-select-label">First attribute</InputLabel>
            <Select
              labelId="first-attribute-select-label"
              id="select-first-attribute"
              value={itemData.firstAttributeName}
              label="First attribute"
              name="firstAttributeName"
              onChange={handleSelectChange}
            >
              <MenuItem value="Poisoning (PD)">Poisoning (PD)</MenuItem>
              <MenuItem value="Light">Light</MenuItem>
              <MenuItem value="Endurance">Endurance</MenuItem>
              <MenuItem value="Casting Probablity (CP)">Casting Probablity (CP)</MenuItem>
              <MenuItem value="Mana Conversion (MCON)">Mana Conversion (MCON)</MenuItem>
              <MenuItem value="Experience (EXP)">Experience (EXP)</MenuItem>
              <MenuItem value="Gold">Gold</MenuItem>
              <MenuItem value="Crush Chance (CC)">Crush Chance (CC)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            type="number"
            label="Value"
            variant="outlined"
            value={itemData.firstAttributeValue}
            name="firstAttributeValue"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="second-attribute-select-label">First attribute</InputLabel>
            <Select
              labelId="second-attribute-select-label"
              id="select-second-attribute"
              value={itemData.secondAttributeName}
              label="First attribute"
              name="secondAttributeName"
              onChange={handleSelectChange}
            >
              <MenuItem value="Poison Resistance (PR)">Poison Resistance (PR)</MenuItem>
              <MenuItem value="Hit Ratio (HR)">Hit Ratio (HR)</MenuItem>
              <MenuItem value="Defense Ratio (DR)">Defense Ratio (DR)</MenuItem>
              <MenuItem value="HP Recovery (HP)">HP Recovery (HP)</MenuItem>
              <MenuItem value="SP Recovery (SP)">SP Recovery (SP)</MenuItem>
              <MenuItem value="MP Recovery (MP)">MP Recovery (MP)</MenuItem>
              <MenuItem value="Magic Resistance (MR)">Magic Resistance (MR)</MenuItem>
              <MenuItem value="Physical Absorption (PA)">Physical Absorption (PA)</MenuItem>
              <MenuItem value="Magical Absorption (MA)">Magical Absorption (MA)</MenuItem>
              <MenuItem value="Experience (EXP)">Experience (EXP)</MenuItem>
              <MenuItem value="Gold">Gold</MenuItem>
              <MenuItem value="Crush Damage (CD)">Crush Damage (CD)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            fullWidth
            type="number"
            label="Value"
            variant="outlined"
            value={itemData.secondAttributeValue}
            name="secondAttributeValue"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Upload an image</Typography>
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            loading={createResolved.loading}
            variant="contained"
            color="primary"
            onClick={handleCreateItem}
          >
            Post item
          </LoadingButton>
        </Grid>
      </Grid>
    </Container>
  )
}