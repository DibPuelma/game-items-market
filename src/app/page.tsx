"use client";

import Link from 'next/link'
import { Button, Container, Stack, Typography } from '@mui/material'

export default function Home() {
  return (
    <Container maxWidth="xl" sx={{ pt: '15%' }}>
        <Typography variant="h4" mb={4} textAlign="center">What do you want to do?</Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Link href="/buy">
            <Button
              variant="outlined"
              color="primary"
            >
              I want to buy
            </Button>
          </Link>
          <Link href="/sell">
            <Button
              variant="outlined"
              color="secondary"
            >
              I want to sell
            </Button>
          </Link>
      </Stack>
    </Container>
  )
}
