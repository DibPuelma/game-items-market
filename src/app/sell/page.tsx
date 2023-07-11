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

const WEAPON_SUB_TYPES = [
  'Short sword',
  'Long sword',
  'Fencing',
  'Axe',
  'Hammer',
  'Bow',
  'Wand',
]

const WEAPON_PRIMARY_ATTRIBUTES = [
  'Critical',
  'Poisoning',
  'HP Siphon',
  'MP Siphon',
  'Light',
  'Strong',
  'Crush Chance',
  'Cast Prob',
]

const WEAPON_SECONDARY_ATTRIBUTES = [
  'Hit Ratio',
  'Consecutive Atk Dmg',
  'Experience',
  'Gold',
  'Crush Damage',
]

const ARMOR_SUB_TYPES = [
  'Shield',
  'Outer body',
  'Inner body',
  'Headgear',
  'Leg',
]

const ARMOR_PRIMARY_ATTRIBUTES = [
  'Light',
  'Endurance',
  'Mana Convert',
  'Critical Increase Chance',
  'Experience',
  'Gold',
]

const ARMOR_SECONDARY_ATTRIBUTES = [
  'Poison Resist',
  'Defense Ratio',
  'Magic Resistance',
  'HP Recovery',
  'MP Recovery',
  'SP Recovery',
  'Physical Absorption',
  'Magical Absorption',
]

const RARE_SUB_TYPES = [
  'Stone',
  'Gem',
  'Necklace',
  'Ring',
  'Spell Manual',
  'Armor',
  'Shield',
  'Short sword',
  'Long sword',
  'Fencing',
  'Axe',
  'Hammer',
  'Bow',
  'Wand',
]

const BASE_ITEM = {
  name: '',
  firstAttributeName: '',
  firstAttributeValue: undefined,
  secondAttributeName: '',
  secondAttributeValue: undefined,
  image_url: null,
  gender: '',
  type: '',
  subType: '',
  price: undefined,
}


//TODO: allow to choose type between armor and weapon and adjust attributes accordingly
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

  const handleSelectChange = (event: SelectChangeEvent, clearOther: boolean = false) => {
    if (clearOther) {
      setItemData({
        ...BASE_ITEM,
        name: itemData.name,
        price: itemData.price,
        [event.target.name]: event.target.value,
      });
      return;
    }

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
    const mandatoryFields = [
      'name',
    ]
    const missingFields = mandatoryFields.filter((field: string) => !itemData[field as keyof typeof itemData])
    if (missingFields.length > 0) {
      alert(`Missing fields: ${missingFields.join(', ')}`)
      return
    }

    try {
      setCreateResolved((oldValue) => ({ ...oldValue, loading: true }));
      const snakeCaseItem = _.mapKeys(itemData, (_value, key) => _.snakeCase(key))
      const { error } = await supabase.from('helbreath_items').insert({ ...snakeCaseItem, user_id: user.id })
      if (error) {
        setCreateResolved((oldValue) => ({ ...oldValue, error: true }));
        return;
      }
      setCreateResolved((oldValue) => ({ ...oldValue, success: true }));
      setItemData(BASE_ITEM)
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
          <Typography variant="h4">What would you like to sell?</Typography>
          <Typography gutterBottom>Prices are in Olympia Coins</Typography>
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
        <Grid item xs={9} sm={10}>
          <TextField
            fullWidth
            label="Item name"
            variant="outlined"
            value={itemData.name}
            name="name"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={3} sm={2}>
          <TextField
            fullWidth
            label="Price"
            variant="outlined"
            type="number"
            value={itemData.price}
            name="price"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id="select-type-label">Type</InputLabel>
            <Select
              labelId="select-type-label"
              id="select-type"
              value={itemData.type}
              label="Type"
              name="type"
              onChange={(e) => handleSelectChange(e, true)}
            >
              <MenuItem value="Weapon">Weapon</MenuItem>
              <MenuItem value="Armor">Armor</MenuItem>
              <MenuItem value="Rare">Rare</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {itemData.type !== 'Other' && (
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="select-sub-type-label">Sub type</InputLabel>
              <Select
                labelId="select-sub-type-label"
                id="select-sub-type"
                value={itemData.subType}
                label="Sub type"
                name="subType"
                onChange={(e) => handleSelectChange(e, false)}
              >
                {itemData.type === 'Rare' && RARE_SUB_TYPES.map((subType) => (
                  <MenuItem key={subType} value={subType}>{subType}</MenuItem>
                ))}
                {itemData.type === 'Weapon' && WEAPON_SUB_TYPES.map((subType) => (
                  <MenuItem key={subType} value={subType}>{subType}</MenuItem>
                ))}
                {itemData.type === 'Armor' && ARMOR_SUB_TYPES.map((subType) => (
                  <MenuItem key={subType} value={subType}>{subType}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {itemData.type === 'Armor' ? (
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="select-gender-label">Gender</InputLabel>
              <Select
                labelId="select-gender-label"
                id="select-gender"
                value={itemData.gender}
                label="Gender"
                name="gender"
                onChange={(e) => handleSelectChange(e, false)}
              >
                <MenuItem value="W">W</MenuItem>
                <MenuItem value="M">M</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <Grid item xs={4} />
        )}
        {itemData.type !== 'Other' && itemData.type !== 'Rare' && (
          <>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="first-attribute-select-label">First attribute</InputLabel>
                <Select
                  labelId="first-attribute-select-label"
                  id="select-first-attribute"
                  value={itemData.firstAttributeName}
                  label="First attribute"
                  name="firstAttributeName"
                  onChange={(e) => handleSelectChange(e, false)}
                >
                  {itemData.type === 'Weapon' && WEAPON_PRIMARY_ATTRIBUTES.map((attribute) => (
                    <MenuItem key={attribute} value={attribute}>{attribute}</MenuItem>
                  ))}
                  {itemData.type === 'Armor' && ARMOR_PRIMARY_ATTRIBUTES.map((attribute) => (
                    <MenuItem key={attribute} value={attribute}>{attribute}</MenuItem>
                  ))}
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
                <InputLabel id="second-attribute-select-label">Second attribute</InputLabel>
                <Select
                  labelId="second-attribute-select-label"
                  id="select-second-attribute"
                  value={itemData.secondAttributeName}
                  label="Second attribute"
                  name="secondAttributeName"
                  onChange={(e) => handleSelectChange(e, false)}
                >
                  {itemData.type === 'Weapon' && WEAPON_SECONDARY_ATTRIBUTES.map((attribute) => (
                    <MenuItem key={attribute} value={attribute}>{attribute}</MenuItem>
                  ))}
                  {itemData.type === 'Armor' && ARMOR_SECONDARY_ATTRIBUTES.map((attribute) => (
                    <MenuItem key={attribute} value={attribute}>{attribute}</MenuItem>
                  ))}
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
          </>
        )}
        {/* <Grid item xs={12}>
          <Typography variant="h6">Upload an image</Typography>
        </Grid> */}
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
    </Container >
  )
}