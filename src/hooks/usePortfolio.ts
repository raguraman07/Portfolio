'use client'

import { useEffect, useState } from 'react'
import {
  fetchCertificates,
  fetchProjects,
  fetchTechStacks,
} from '@/lib/portfolioService'

export interface PortfolioProject {
  id: string
  title: string
  description: string
  image_url: string
  live_url?: string
  github_url?: string
}

export interface PortfolioCertificate {
  id: string
  title: string
  image_url: string
}

export interface PortfolioTechStack {
  id: string
  name: string
  logo_url: string
}

export default function usePortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [certificates, setCertificates] =
    useState<PortfolioCertificate[]>([])
  const [techStacks, setTechStacks] =
    useState<PortfolioTechStack[]>([])

  const [loading, setLoading] = useState(true)

  const loadPortfolio = async () => {
    const cachedProjects =
      sessionStorage.getItem(
        'portfolioProjects'
      )

    const cachedCertificates =
      sessionStorage.getItem(
        'portfolioCertificates'
      )

    const cachedTechStacks =
      sessionStorage.getItem(
        'portfolioTechStacks'
      )

    if (cachedProjects) {
      setProjects(JSON.parse(cachedProjects))
    }

    if (cachedCertificates) {
      setCertificates(
        JSON.parse(cachedCertificates)
      )
    }

    if (cachedTechStacks) {
      setTechStacks(
        JSON.parse(cachedTechStacks)
      )
    }

    const [
      projectsData,
      certificatesData,
      techStacksData,
    ] = await Promise.all([
      fetchProjects(),
      fetchCertificates(),
      fetchTechStacks(),
    ])

    setProjects(projectsData || [])
    setCertificates(certificatesData || [])
    setTechStacks(techStacksData || [])

    sessionStorage.setItem(
      'portfolioProjects',
      JSON.stringify(projectsData || [])
    )

    sessionStorage.setItem(
      'portfolioCertificates',
      JSON.stringify(certificatesData || [])
    )

    sessionStorage.setItem(
      'portfolioTechStacks',
      JSON.stringify(techStacksData || [])
    )

    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPortfolio()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return {
    projects,
    certificates,
    techStacks,
    loading,
  }
}