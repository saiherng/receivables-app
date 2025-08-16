'use client';
import React from 'react';
import { Button, Select, Flex, Icon } from '@chakra-ui/react';
import { useTheme } from './ThemeProvider';
import { Palette, Sun, Moon, Droplets, Leaf } from 'lucide-react';

const themeIcons = {
  light: Sun,
  dark: Moon,
  blue: Droplets,
  green: Leaf,
};

const themeNames = {
  light: 'Light',
  dark: 'Dark',
  blue: 'Blue',
  green: 'Green',
};

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <Flex align="center" gap={2}>
      <Icon as={Palette} w="16px" h="16px" color="gray.500" />
      <Select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        width="128px"
      >
        {themes.map((themeOption) => {
          const IconComponent = themeIcons[themeOption];
          return (
            <option key={themeOption} value={themeOption}>
              {themeNames[themeOption]}
            </option>
          );
        })}
      </Select>
    </Flex>
  );
}

export function ThemeSwitcherButtons() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <Flex align="center" gap={1}>
      {themes.map((themeOption) => {
        const IconComponent = themeIcons[themeOption];
        const isActive = theme === themeOption;
        
        return (
          <Button
            key={themeOption}
            variant={isActive ? "solid" : "outline"}
            size="sm"
            onClick={() => setTheme(themeOption)}
            width="32px"
            height="32px"
            p={0}
            colorScheme={isActive ? "orange" : "gray"}
            title={`Switch to ${themeNames[themeOption]} theme`}
          >
            <Icon as={IconComponent} w="16px" h="16px" />
          </Button>
        );
      })}
    </Flex>
  );
}
