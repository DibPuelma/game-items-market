'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AppBar as MuiAppBar, IconButton, Menu, MenuItem, Toolbar, Stack, Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import type { Database } from '@/lib/database.types'
import SignUpDialog from '../auth/SignUpDialog';
import { useRouter } from 'next/navigation';
import SignInDialog from '../auth/SignInDialog';
import Link from 'next/link';

export default function AppBar() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [user, setUser] = useState<null | any>(null)
  const [signUpDialogOpen, setSignUpDialogOpen] = useState<boolean>(false)
  const [signInDialogOpen, setSignInDialogOpen] = useState<boolean>(false)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getSession()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    closeMenu();
    window.location.reload();
  }

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  };

  const closeMenu = () => {
    setAnchorEl(null)
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

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Stack width='100%' direction="row" alignItems="center" justifyContent="space-between">
          <Stack width="3%" />
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link href="/buy">
              <Button sx={{ color: 'white' }}>
                Buy
              </Button>
            </Link>
            <Link href="/sell">
              <Button sx={{ color: 'white' }}>
                Sell
              </Button>
            </Link>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={user ? 0 : 2}>
            {user ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={openMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                >
                  <MenuItem disabled>{user.email}</MenuItem>
                  <Link className="no-link-style" href="/my-items">
                    <MenuItem>
                      My items
                    </MenuItem>
                  </Link>
                  <Link className="no-link-style" href="/profile">
                    <MenuItem>
                      Profile
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="text"
                  sx={{ color: 'white' }}
                  onClick={openSignInDialog}
                >
                  Sign in
                </Button>
                <Button
                  variant="text"
                  sx={{ color: 'white' }}
                  onClick={openSignUpDialog}
                >
                  Sign up
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Toolbar>
      <SignUpDialog open={signUpDialogOpen} onClose={closeSignUpDialog} />
      <SignInDialog open={signInDialogOpen} onClose={closeSignInDialog} />
    </MuiAppBar>
  )
}