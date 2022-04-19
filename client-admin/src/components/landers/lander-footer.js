/** @jsx jsx */
import { Component } from 'react'
import { Box, Link, Heading, jsx } from 'theme-ui'

import emoji from 'react-easy-emoji'

class Header extends Component {
  render() {
    return (
      <Box sx={{ mt: [3, null, 4] }}>
        <Heading
          as="h3"
          sx={{ fontSize: [4], lineHeight: 'body', my: [2, null, 3] }}>
          Legal
        </Heading>
        <Box sx={{ mb: [2, null, 3], maxWidth: '30em' }}>
          Polis is built for the public with {emoji('❤️', { props: { alt: 'love' } })} in Seattle{' '}
          {emoji('🇺🇸', { props: { alt: 'USA' } })}, with contributions from around the{' '}
          {emoji('🌍🌏🌎', { props: { alt: 'world' } })}
        </Box>
        <Box sx={{ mb: [2, null, 3] }}>
          © {new Date().getFullYear()} The Authors <Link href="tos">TOS</Link>{' '}
          <Link href="privacy">Privacy</Link>
        </Box>
      </Box>
    )
  }
}

export default Header;
