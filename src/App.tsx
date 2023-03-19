import { Stack, Card, ListGroup, Form, Button, Alert, Nav, Navbar, Container, NavDropdown, Modal } from "react-bootstrap"
import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import sandcrystal from './sandcrystal.png'
import abi from './log3Abi.json'

export default function App() {
  const [address, setAddress] = useState(null)
  const [isAddress, setIsAddress]
    = useState(false)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [logs, setLogs] = useState<Array<{ header: string; body: string; author: string; date: string }>>([]);
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [header, setHeader] = useState('')
  const abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "header",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "body",
          "type": "string"
        }
      ],
      "name": "addLog",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "author",
          "type": "address"
        }
      ],
      "name": "getLogs",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "header",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "body",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "author",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "date",
              "type": "uint256"
            }
          ],
          "internalType": "struct LogContract.Log[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  const log3Address = '0x220A4a0a39d345fF46D3c47dAbBeEa8b3621ab39'

  const handleSubmit = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get user accounts from Metamask
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner(accounts[0]);
    const log3Contract = new ethers.Contract(log3Address, abi, signer)
    console.log(log3Contract)
    let title = document.getElementById('title').value
    let body = document.getElementById('body').value
    console.log(title)
    if (title && body != null) {
      let tx = await log3Contract.addLog(title, body);
      tx.wait()
      alert(`Your log has been added to the blockchain!\n
      View transaction details on  Etherscan with the following transaction hash:\n
      ${tx.hash}`)

    } else {
      alert('Please add both Title and Log!')

    }
  }

  const handleGet = async (e: event) => {
    e.preventDefault()
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get user accounts from Metamask
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner(accounts[0]);
    const log3Contract = new ethers.Contract(log3Address, abi, signer)
    const logs = await log3Contract.getLogs(address)
    setLogs((prevLogs) => [...prevLogs, ...logs]);
    logs.forEach((log) => {
  console.log(log)
  const { header, body, author, date } = log;
  let logList = document.getElementById('log-list')
  let headerElement = document.createElement('p');
  headerElement.innerText = header;
  headerElement.addEventListener("click", (e) => {
    // Retrieve the log data based on the clicked header element
    const clickedLog = logs.find((log) => log.header === (e.target as HTMLParagraphElement).innerText); // Add type assertion here
    // Set the log data to the modal body and author fields
    setShow(true);
    setBody(clickedLog.body);
    setAuthor(clickedLog.author);
    setHeader(clickedLog.header);
  });
  logList.appendChild(headerElement);
})

    document.getElementById('log-display').style.visibility = 'visible'
  }
  // Handle login button click 
  const handleLogin = async () => {
    // Check if Metamask is installed and available
    if (window.ethereum !== 'null') {
      // Connect to Metamask provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Get user accounts from Metamask
      const accounts = await provider.send("eth_requestAccounts", []);
      // Update state with first account
      setAddress(accounts[0]);

      setIsAddress(true);


      // Hide connect button
      document.getElementById('login').style.visibility = "hidden"
      document.getElementById('addy').style.visibility = "visible"
      document.getElementById('welcome').style.visibility = "hidden"
      document.getElementById('card').style.visibility = "visible"
    } else {
      // Alert user to install Metamask
      alert("Please install Metamask")
    }
  }
  return (
    <>
      <div className="bg-dark text-white h-100 w-100">
        <Navbar expand="lg" className="text-white" style={{ 'background-color': 'black', }}>
          <Container>
            <Navbar.Brand className="text-white" href="#home">Log III</Navbar.Brand>
            <Nav className="ml-auto">
              <Form>
                <Button id="login" className="mt-2 mb-2" style={{ 'background-color': '#D2AA6D', 'border': 'none' }} onClick={handleLogin}>Connect Wallet</Button>
              </Form>
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text id="addy" style={{ 'visibility': 'hidden' }}>
                  <div className="ml-5" style={{ 'background-color': '#D2AA6D', 'color': 'white', 'border-radius': '7px', 'padding': '7px', 'position': 'relative' }}>
                    Address: {address}
                  </div>
                </Navbar.Text>
              </Navbar.Collapse>
            </Nav>
          </Container>
        </Navbar>
        <div className=" d-flex justify-content-center align-items-center" style={{ 'position': 'relative', 'margin-top': '100px' }}>
          <div id="welcome" style={{ 'position': 'absolute' }} >
            <h2 className="text-center mt-3">Welcome to Log III </h2>
            <h4 className="text-center mt-3">Connect wallet to Log events  on the Ethereum blockchain</h4>
            <div className="text-center mt-2"
            >
              <img src={sandcrystal} width="400px" height="400px" />
            </div>
          </div>
          <Card id="card" bg="dark" className="w-25 mx-auto text-center shadow-lg" style={{ 'visibility': 'hidden', 'z-index': '9', }}>
            <Card.Header id="log-header" style={{ 'background-color': 'black' }}></Card.Header>
            <Card.Body style={{ 'background-color': 'black' }}>
              <Card.Title id="log-body"></Card.Title>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control id="title" type="text" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Log</Form.Label>
                <Form.Control id="body" as="textarea" rows={3} />
              </Form.Group>
              <Button onClick={handleSubmit} style={{ 'background-color': '#D2AA6D', 'border': 'none' }}>Submit </Button>
            </Card.Body>
            <Card.Footer className="text-muted" style={{ 'background-color': 'black' }}>
              <Button className="mb-3" onClick={handleGet} style={{ 'background-color': '#D2AA6D', 'border': 'none' }}>Get Logs</Button>
            </Card.Footer>
          </Card>
          <Card id="log-display" bg="dark" className="w-25 mx-auto text-center shadow-lg" style={{ 'z-index': '9', 'visibility': 'hidden' }}>
            <Card.Header style={{ 'background-color': 'black' }}>Your Logs</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item id="log-list"></ListGroup.Item>
            </ListGroup>
          </Card>
          <Modal style={{ 'background-color': 'black', 'text-align' : 'center' }} show={show} onHide={handleClose}>
            <Modal.Header style={{ 'text-align' : 'center', }} closeButton>
              <Modal.Title >{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><span id="modal_body">{body}</span></p>
             
            </Modal.Body>
            <Modal.Footer style={{ 'text-align' : 'center' }}>
               <h6 style={{'margin-right' : '5px'}}>Author: <span id="modal_author">{author}</span></h6>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  )
}
