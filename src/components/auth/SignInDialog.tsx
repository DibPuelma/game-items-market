'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation"

import type { Database } from '@/lib/database.types'
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';

type QueryResult = {
  loading?: boolean,
  success?: boolean,
  error?: boolean,
}


export default function SignInDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [signInQuery, setSignInQuery] = useState<QueryResult>({ loading: false })
  const router = useRouter();
  const supabase = createClientComponentClient<Database>()

  const handleSignIn = async () => {
    setSignInQuery({ loading: true })
    try {
      await supabase.auth.signInWithPassword({
        email,
        password,
      })
      onClose();
      window.location.reload();
    } catch (error) {
      setSignInQuery({ error: true })
    } finally {
      setSignInQuery((oldValue) => ({ ...oldValue, loading: false }))
    }
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To sign in, please enter your email address and password.
        </DialogContentText>
        <TextField
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="dense"
          id="password"
          label="Password"
          type="password"
          fullWidth
        />
      </DialogContent >
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={signInQuery.loading} onClick={handleSignIn}>Sign In</LoadingButton>
      </DialogActions>
    </Dialog >
  )
}