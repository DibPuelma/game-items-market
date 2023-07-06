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


export default function SignUpDialog({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [signUpQuery, setSignUpQuery] = useState<QueryResult>({ loading: false })
  const router = useRouter();
  const supabase = createClientComponentClient<Database>()

  const handleSignUp = async () => {
    setSignUpQuery({ loading: true })
    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      setSignUpQuery({ success: true })
    } catch (error) {
      setSignUpQuery({ error: true })
    } finally {
      setSignUpQuery((oldValue) => ({ ...oldValue, loading: false }))
    }
    router.refresh()
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign Up</DialogTitle>
      {signUpQuery.success ? (
        <DialogContent>
          <DialogContentText>
            <Typography variant="h6" component="div">
              Check your email for the confirmation link. After that you can login.
            </Typography>
          </DialogContentText>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <DialogContentText>
              To sign up, please enter your email address and choose a password.
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
            <LoadingButton loading={signUpQuery.loading} onClick={handleSignUp}>Sign Up</LoadingButton>
          </DialogActions>
        </>
      )
      }
    </Dialog >
  )
}