import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  it('merges standard classes correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('handles conditional rendering correctly', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
  })

  it('handles overriding Tailwind classes correctly (twMerge)', () => {
    expect(cn('p-4 text-red-500', 'p-8')).toBe('text-red-500 p-8')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('handles arrays and nested arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
    expect(cn(['class1', ['class2', 'class3']])).toBe('class1 class2 class3')
  })

  it('handles objects correctly', () => {
    expect(cn({ 'class1': true, 'class2': false, 'class3': true })).toBe('class1 class3')
  })

  it('handles undefined, null and empty strings', () => {
    expect(cn('class1', undefined, null, '', 'class2')).toBe('class1 class2')
  })
})
