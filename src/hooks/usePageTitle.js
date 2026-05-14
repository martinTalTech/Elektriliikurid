import { useEffect } from 'react'

const SITE_NAME = 'elektriliikur.ee'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    return () => {
      document.title = SITE_NAME
    }
  }, [title])
}
