"use client";
// make client-side app for simplicity sake
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import { collection, query, doc, getDoc, getDocs, setDoc, deleteDoc} from 'firebase/firestore'


export default function Home() {
  //state variable to store inventory, modal, and to store item names
  //using [a, b] iterable destructuring assignment instead of object destructuring {a,b}
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false) //!set default value as false
  const [itemName, setItemName] = useState('') //set empty str as default value

  //add helper functions
  const updateInventory = async () => { //? arrow function?
    const snapshot = query(collection(firestore, 'inventory-mgmt-collection')) //get inventory snapshot from firestore
    const docs = await getDocs(snapshot) //get docs from firestore
    const inventoryList = []
    docs.forEach((doc) => { //for every element in docs, add the name and data to inventory list
      inventoryList.push({
        name: doc.id,
        ...doc.data(), //* 3 dots is the "spread syntax" The spread (...) syntax allows an iterable, such as an array or string, to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected. In an object literal, the spread syntax enumerates the properties of an object and adds the key-value pairs to the object being created. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      })
    })
    setInventory(inventoryList)

  }
  //helper function to delete item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory-mgmt-collection'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) { //then delete it
        await deleteDoc(docRef)
      }
      else { //?else, do nothing - set docRef = quantity - 1
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  //helper function to add item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory-mgmt-collection'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) { //then add one
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else { //doesn't exist, then set to 1
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  useEffect(() => { //run once when page loads - only update then
    updateInventory()
  }, []
  )

  //modal helper functions
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  //material UI: modal component provides a solid foundation for creating dialogs, popovers, lightboxes, or whatever else.

  return (
    <
      Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection={"column"}
      justifyContent='center'
      alignItems='center'
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position='absolute'
          top='50%'
          left='50%'

          width={400}
          bgcolor={'white'}
          border={'2px solid #000'}
          boxShadow={24}
          p={4}
          display={'flex'}
          flexDirection={'column'}
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)'
          }}
        >
          <Typography variant='h6'> Add Item </Typography>
          <Stack width={'100%'} direction='row' spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            ></TextField>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      <Box
        border={'1px solid #333'}
      >
        <Box
          width={'800px'}
          height='100px'
          bgcolor={'#ADD8'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Typography variant="h2" color={'#333'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width={'800px'} height={'300px'} spacing={2} overflow={'auto'}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width='100%'
              minHeight={'150px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              bgcolor={'#f0f0f0'}
              padding={5}
            >
              <Typography variant="h3" color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color={'#333'} textAlign={'center'}>
                {quantity}
              </Typography>
              
              <Stack direction={'row'} spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  addItem(name)
                }}
              >
                Add
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  removeItem(name)
                }}
              >
                Remove
              </Button>
              </Stack>
              

            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
