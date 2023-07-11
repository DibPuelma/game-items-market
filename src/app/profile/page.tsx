'use client'

import { Button, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import useSession from "../hooks/useSession";
import { useEffect, useState } from "react";
import useSupabase from "../hooks/useSupabase";
import { LoadingButton } from "@mui/lab";
import useQueryStatus from "../hooks/useQueryStatus";

type UserProfile = {
  full_name?: string | null,
  discord_id?: string | null,
}

export default function Profile() {
  const supabase = useSupabase()
  const { user } = useSession()
  const [loading, setLoading] = useState<boolean>(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    full_name: '',
    discord_id: '',
  });
  const { status, changeStatusAttribute } = useQueryStatus();

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setUserProfile(profile)
      setLoading(false)
    }
    if (!user) return
    getUserProfile();
  }, [user, supabase])

  const handleSaveProfile = async () => {
    if (!userProfile?.discord_id) return;
    changeStatusAttribute('loading', true)
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: userProfile?.full_name,
        discord_id: userProfile?.discord_id,
      }).eq('id', user.id)
      if (error) changeStatusAttribute('error', true)
      else changeStatusAttribute('success', true)
    } finally {
      changeStatusAttribute('loading', false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      {loading ? (
        <Stack width="100%" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <Stack width="100%" alignItems="center" rowGap={2}>
          <Typography variant="h4" mt={2} mb={4}>Your profile</Typography>
          <TextField
            label="Full name"
            variant="outlined"
            value={userProfile?.full_name}
            onChange={(e) => setUserProfile((oldValue) => ({ ...oldValue, full_name: e.target.value }))}
          />
          <TextField
            label="Discord ID"
            variant="outlined"
            value={userProfile?.discord_id}
            onChange={(e) => setUserProfile((oldValue) => ({ ...oldValue, discord_id: e.target.value }))}
          />
          {status.success && (
            <Typography variant="body1" color="success.main">Profile saved!</Typography>
          )}
          <LoadingButton
            variant="contained"
            onClick={handleSaveProfile}
            loading={status.loading}
          >
            Save
          </LoadingButton>
        </Stack>
      )}
    </Container>
  )
}