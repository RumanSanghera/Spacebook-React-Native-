import React, {Component} from 'react';
import { ScrollView ,View ,Text ,FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Add the ablity to show user profile of requested user and able to click on the name and link to there profile

class MyFreinds extends Component  {

  constructor(props){
    super(props);
    this.state =
    { 
      isLoading: true,
      ReqList: [],
      FriendList: [],
    }
  }
  componentDidMount() 
  {
   
    this.unsubscribe = this.props.navigation.addListener('focus', () => 
    {
      this.checkLoggedIn();
      this.getReqList();
      this.getFriendList();
    });
   
   
  }
  
  componentWillUnmount()
  {
    this.unsubscribe();
  }

  checkLoggedIn = async () => 
  {
    const value = await AsyncStorage.getItem('@session_token');
    //console.log(value)

    if (value == null) 
    {
        this.props.navigation.navigate('Login');
    }
  };

  AcceptReq = async(id) =>{
    
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id, {
      method: 'POST',
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log(responseJson);
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })
  }

  DeclineReq = async(id) =>{
    
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+id, {
      method: 'DELETE',
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        return response.json()
      }else{
          throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log(responseJson);
      })
      
    
    .catch((error) => {
        console.log(error);
        
    })
  
  }

  getFriendList = async () => {
    
    const value = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('@id');
    
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/friends", {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    this.setState({
      
      FriendList: responseJson,
      isLoading: false,
    })
    console.log(this.state.FriendList ,"freind list")
    
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  }



  getReqList = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    
    return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
      'headers': {
        'X-Authorization':  value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else{
          throw 'Something went wrong';
      }
  })
  .then((responseJson) => {
    this.setState({
      ReqList: responseJson
    })
    console.log(this.state.ReqList , "reqList");
    
    
  })
  .catch((error) => {
      console.log(error);
      
  })
  }

  render()
 
    {

      if (this.state.isLoading){
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Loading..</Text>
          </View>
        );
      }else{
        
    return(
    
        <View>
          <FlatList
                data={this.state.ReqList}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      <Text>Freind Requests</Text>

                    <Button
                    title={item.first_name+" "+item.last_name}
                    onPress= { () => this.props.navigation.navigate('Profile',{ id: String(item.user_id)}) }
                    />

                      <Button
                      title="Accept"
                      onPress={() => {this.AcceptReq(item.user_id)}}
                      />

                      <Button
                      title="Decline"
                      onPress={() => {this.DeclineReq(item.user_id)}}
                      />

                    </ScrollView>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}

              />
             <Text>Friends List:</Text>
             <FlatList
                data={this.state.FriendList}
                getChildrenName={(data) => 'item'}
                renderItem={({item}) => 
                (
                    <ScrollView>
                      <Text></Text>
                      <Button
                      title={item.user_givenname+" "+item.user_familyname}
                      onPress= { () => this.props.navigation.navigate('Profile',{ id: String(item.user_id)}) }/>
                    </ScrollView>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
                />


              </View>
              );
        }
  
        
      }        
      
  
  
}

export default MyFreinds;