import { useEffect, useMemo, useState } from 'react'
import { Accordion, AppShell, Box, Container, Group, Select, Text, TextInput, Title } from '@mantine/core'
import type { ClassData, Rarity } from './types'
import db from './db.json'

const data = db.classes as unknown as ClassData[]

const colorMap: Record<Rarity, string> = {
  epic: '#720d9a',
  legendary: '#a05409',
  artifact: '#a4846c'
}

function App() {
  const [currentClass, setCurrentClass] = useState<string | null>('Paladin')

  const [filterSearch, setFilterSearch] = useState<string>('')
  const [filterRarity, setFilterRarity] = useState<Rarity | null>(null)
  const [filterSpec, setFilterSpec] = useState<string | null>(null)

  const classData = useMemo(() => {
    return data.find((c) => c.name === currentClass)!
  }, [currentClass])

  const filteredRes = useMemo(() => {
    return classData.res
      .filter((re) => {
        if (filterSearch && !re.name.toLowerCase().includes(filterSearch.toLowerCase())) {
          return false
        }

        if (filterRarity && re.rarity !== filterRarity) {
          return false
        }

        if (filterSpec && !re.specs.includes(filterSpec)) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        const rarityOrder: Rarity[] = ['artifact', 'legendary', 'epic']

        if (a.rarity !== b.rarity) {
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
        }

        return a.name.localeCompare(b.name)
      })
  }, [classData, filterRarity, filterSpec, filterSearch])

  const filteredReItems = useMemo(() => {
    return filteredRes.map(re => (
      <Accordion.Item 
        key={re.name} 
        value={re.name}
        bg={colorMap[re.rarity]}
      >
        <Accordion.Control
          disabled={re.location === ''}
        >
          {re.name}
        </Accordion.Control>
        <Accordion.Panel>{re.location || 'Unknown'}</Accordion.Panel>
      </Accordion.Item>
    ))
  }, [filteredRes])

  /// We changed class, reset filters and current RE
  useEffect(() => {
    setFilterSearch('')
    setFilterRarity(null)
    setFilterSpec(null)
  }, [currentClass])

  const trackStats = useMemo(() => {
    const allRes = data.reduce((acc, cls) => {
      acc.push(...cls.res)
      return acc
    }, [] as ClassData['res'])

    const populated = allRes.filter(re => re.location !== '')

    return { 
      total: allRes.length, 
      populated: populated.length 
    }
  }, [])

  return (
    <AppShell>
      <AppShell.Main>
        <Container>
          <Group
            mt='md'
            mb='md'
            align='end'
            justify='space-between'
          >
            <Title>Bronzebeard RE Tracker</Title>
            <Text c="dimmed">
              {trackStats.populated}/{trackStats.total} tracked ({((trackStats.populated / trackStats.total) * 100).toFixed(2)}%)
            </Text>
          </Group>
          
          <Box
            mb={'md'}
          >
            <Select
              value={currentClass}
              onChange={v => v !== null && v !== currentClass && setCurrentClass(v)}
              data={data.map((c) => c.name)}
            />
          </Box>

          <Box
            mb={'md'}
          >
            <Group>
              <TextInput
                style={{ flex: 1 }}
                value={filterSearch}
                onChange={e => setFilterSearch(e.currentTarget.value)}
                placeholder="Search..."
              />

              <Select
                value={filterRarity}
                onChange={v => setFilterRarity(v == 'any' ? null : v as Rarity)}
                placeholder="Filter by Rarity"
                data={[
                  { value: 'artifact', label: 'Artifact' },
                  { value: 'legendary', label: 'Legendary' },
                  { value: 'epic', label: 'Epic' },
                ]}
              />

              <Select
                value={filterSpec}
                onChange={setFilterSpec}
                placeholder="Filter by Spec"
                data={[...classData.specs.map(s => s.name)]}
              />
            </Group>
          </Box>

          <Accordion
            variant="separated"
          >
            {filteredReItems}
          </Accordion>
        </Container>
        <Container
          mt="sm"
          p="lg"
        >
          <Text ta="center" c="dimmed">
            Help me add locations or information! Discord: qru
          </Text>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
