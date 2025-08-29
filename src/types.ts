export type Rarity = 'epic' | 'legendary' | 'artifact'

export type Spec = {
  name: string,
  icon: string,
}

export type RE = {
  name: string,
  rarity: Rarity,
  location: string,
  specs: string[], // Spec names
}

export type ClassData = {
  name: string,
  icon: string,
  specs: Spec[],
  res: RE[],
}
