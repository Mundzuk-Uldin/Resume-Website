/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'float-delay': 'float-delay 6s ease-in-out 1s infinite',
          'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
          'spin-slow': 'spin-slow 20s linear infinite',
          'blink': 'blink 1s step-end infinite',
          'scrollDown': 'scrollDown 2s infinite',
          'progressJavaScript': 'progressJavaScript 1.5s ease-out forwards',
          'progressPython': 'progressPython 1.5s 0.3s ease-out forwards',
          'progressJava': 'progressJava 1.5s 0.6s ease-out forwards',
          'progressCSharp': 'progressCSharp 1.5s 0.9s ease-out forwards',
          'flare': 'flare 4s ease-in-out infinite',
          'flare-delay': 'flare-delay 4s 2s ease-in-out infinite',
          'gradient': 'gradient 15s ease infinite',
          'gradient-alt': 'gradient-alt 15s ease infinite',
          'loadingBar': 'loadingBar 4s ease-in-out forwards',
          'fadeIn': 'fadeIn 1s ease-out forwards',
          'skillFadeIn': 'skillFadeIn 0.5s ease-out forwards',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-15px)' },
          },
          'float-delay': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          'pulse-slow': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.7' },
          },
          'spin-slow': {
            'from': { transform: 'rotate(0deg)' },
            'to': { transform: 'rotate(360deg)' },
          },
          blink: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0' },
          },
          scrollDown: {
            '0%': { transform: 'translateY(0)', opacity: '1' },
            '75%': { transform: 'translateY(5px)', opacity: '0' },
            '80%': { transform: 'translateY(-5px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          progressJavaScript: {
            '0%': { width: '0%' },
            '100%': { width: '90%' },
          },
          progressPython: {
            '0%': { width: '0%' },
            '100%': { width: '85%' },
          },
          progressJava: {
            '0%': { width: '0%' },
            '100%': { width: '80%' },
          },
          progressCSharp: {
            '0%': { width: '0%' },
            '100%': { width: '75%' },
          },
          flare: {
            '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
            '50%': { transform: 'scale(1.5)', opacity: '0.3' },
          },
          'flare-delay': {
            '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
            '50%': { transform: 'scale(1.5)', opacity: '0.3' },
          },
          gradient: {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          'gradient-alt': {
            '0%': { backgroundPosition: '100% 50%' },
            '50%': { backgroundPosition: '0% 50%' },
            '100%': { backgroundPosition: '100% 50%' },
          },
          loadingBar: {
            '0%': { width: '0%' },
            '100%': { width: '100%' },
          },
          fadeIn: {
            'from': { opacity: '0' },
            'to': { opacity: '1' },
          },
          skillFadeIn: {
            'from': { opacity: '0', transform: 'translateY(10px)' },
            'to': { opacity: '1', transform: 'translateY(0)' },
          },
        }
      },
    },
    plugins: [],
  }