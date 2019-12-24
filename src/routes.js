import React from 'react'
import {Image} from 'react-native'
import {createAppContainer, createStackNavigator } from 'react-navigation'

import logo from './assets/instagram.png'

import Feed from './pages/Feed'

export default createAppContainer(
  createStackNavigator({
    Feed
  },{
    headerLayoutPreset: 'center',
    defaultNavigatonOptions: {
      headerTitle: <Image source={logo} />,
      headerStyle: {
        backgroundColor: '#f5f5f5'
      }
    },
  })
)
