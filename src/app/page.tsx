"use client";

import styles from './page.module.css'
import Link from 'next/link'
import { Button, Stack } from '@mui/material'

export default function Home() {
  return (
    <main className={styles.main}>
      <Stack direction="row" spacing={2}>
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
    </main>
  )
}
