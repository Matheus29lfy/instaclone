import React, {useState, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import LazyImage from '../../components/LazyImage'
import {Container, Post, Header, Avatar, Name, Description, Loading } from './styles';

export default function Feed() {
const [feed, setFeed] = useState([])
const [ page, setPage ] = useState(1)
const [total, setTotal] = useState(0)
const [loading, setLoading] = useState(false)
const [refreshing, setRefreshing] = useState(false)
const [viewable, setViewable] = useState([])


async function loadPage(pageNumber = page, shouldRefresh = false ) {

  if(pageNumber === total ) return
  if(loading) return

  setLoading(true)

  const response = await fetch (
    `http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`
  )
   const data = await response.json()
   const totalItems = response.headers.get('X-Total-Count')
   
   setLoading(false)
   setTotal(Math.floor(totalItems / 5))
   setFeed(shouldRefresh ? data : [...feed, ...data])
   setPage(pageNumber + 1 )
  
}

async function refreshList(){
  setRefreshing(true)

  await loadPage(1, true)

  setRefreshing(false)

}

useEffect(() => {

  loadPage()

}, [])

const handleViewableChanged = useCallback(({ changed }) => {
  setViewable(changed.map(({item}) => item.id))
}, [])

  return (
    <Container>
      <FlatList 
      key='list'
      data={feed}
      keyExtractor={post => String(post.id)}
      onViewableItemsChanged={handleViewableChanged}
      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20,}}

      onEndReached={ () => loadPage()} 
      onEndReachedThreshold = {0.1}
      showsVerticalScrollIndicator={false}
      onRefresh={refreshList}
      refreshing={refreshing}
      ListFooterComponent={loading && <Loading />}
      renderItem={({ item }) => (
        <Post>
          <Header>
            <Avatar source={{uri: item.author.avatar}} />
           <Name>{item.author.name}</Name>
          </Header>

          <LazyImage
           shouldLoad={viewable.includes(item.id)}
           ratio= {item.aspectRatio}
           smallSource = {{uri: item.small}} 
           source = {{uri: item.image}}
           />
         
          <Description>
         <Name>{item.author.name}</Name>{item.description}
          </Description>
        </Post>
      )}
      />   
    </Container>
  );
}
