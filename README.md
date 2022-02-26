# SpeedInfoManager-B

![logo](./logo.svg)
Backend Inventory and asset management system for a non disclosed company

## <!--    ...    -->MVP<!-- ... -->

#### Requirements

- Allow user to quickly take inventory of shop
- Provide counts in the specific order requested

#### Potential solutions

- User will enter parts in the order they are on the shelves
  - Use an array to store location [rack(or wall), Shelve, Position(from left to right)]

## Data Structures

#### Store

- Store ID
- Store Location
  - Address
  - Coordinates (allow for efficient part transferring between stores in the future)
- Inventory Order
- Part Order List
- Inventory Logs

#### User

- Position
- Permissions
- Password
- Certification (eventually allow mechanics to be assigned tasks based on their capabilities)

#### Inventory Logs

- Location of generated excel file
- Variations from expected count

#### Part

- Part number
- Part Image URL
- Part Description

## <!--    ...    -->Functions<!-- ... -->

- Part
  - Add Part
  - Remove Part
  - Patch Part Info
  - Patch Part Photo
  - Delete Part Photo
  - Edit Part Location
  - Get Part
- Inventory
  - Add Count
  - Postpone Count
    - Skip count until the end(come back to that part later)
  - Patch Count
  - Delete Count(not sure if I want this for abuse maybe manager only)
  - Get Count
  - Process Count
    - When Finished Counting all items it will CLOSE the inventory
    - Compare expected part count to actual part count
    - No longer allow basic mechanics to change
  - Send Count
    - Will notify Manager count has been complete
      -eventually add a time the count has been running
    - Email produced spread sheet to the person that needs it
- Part Order List
  - Upload part list
    - pulls apart part list provided to create a new order of parts

## <!--    ...     -->Version Stage Planning<!-- ... -->

### ideas, no scheduled version yet

- make it so the parts will automatically be set to reorder when they run low
- give cost estimates of parts
- give managers access to "lost" parts
- keep track of karts at each store
- Allow track employees to use a "STUPID" cart diagnostics tool to allow the mechanics to keep track of issues with carts
- Assign mechanics task based on priority and their technical knowledge.
- Allow managers to view states of all current carts and what is needed on each
- Allow managers to view the number of carts in service
- Keep logs of services performed on specific carts
- Allow mechanics to leave notes about specific carts
  - Add filters so mechanics can not leave inappropriate comments using filters searching for specific words or phrases
- Multiple "Stores" or "Locations" and have specific users allowed to access info across stores and some that will not.

### V 1.01.00

### V 1.02.00

### V 1.03.00

### V 1.04.00
