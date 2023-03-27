## LOGIII

# Welcome to LogIII

This is a React application that interacts with an Ethereum smart contract. The app allows users to log messages to the smart contract and retrieve logs from the contract using an Ethereum address. It also connects to the user's Ethereum wallet using Metamask.

The app uses the React Bootstrap library for UI components and the Ethers.js library for interacting with the Ethereum network. It also imports a contract ABI and a contract address for interacting with the smart contract. It requires Goerli Eth to facilitate transactions with the smart contract

The app has the following main components:

A Navbar with a "Connect Wallet" button that prompts the user to connect their wallet using Metamask.

A Card component that allows users to add new logs to the smart contract. It includes input fields for the log title and body and a button to submit the log.

A Form component that allows users to enter an Ethereum address and retrieve logs from the smart contract associated with that address. The retrieved logs are displayed in a ListGroup component.

A Modal component that displays the full log body and author when a user clicks on a log title in the ListGroup.

An Alert component that displays a message when a log is successfully added to the smart contract.

The app also has several state variables for managing the user's Ethereum address, the logs retrieved from the smart contract, and the visibility of certain components. It uses the useEffect hook to listen for changes to the user's Ethereum address and update the UI accordingly. It also uses the useState hook to manage the state of input fields and other UI components.n
