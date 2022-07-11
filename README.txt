Name        :   Jonathan.
Student No. :   101161272

-   server.js is the server file.

-   please update the config.js file with your log in details.

-   fridges-router.js contains all the route methods for URLs starting with /fridges.
-   item-router.js contains all the route methods for URLs starting with /items.
-   search-router.js contains all the route methods for URLs starting with /search.

-   the public folder contains all the files for the client-side application (bonus marks)

-   install the packages if needed:
        npm install express
        npm install mongodb
        npm install mongoose
        

Postman Testings:

start the server by, 
node server.js


3.1.1       request : GET
            url     : http://localhost:8000/fridges
            headers : 
                        - Key   : Accept
                        - Value : application/json

3.1.2       request : GET
            url     : http://localhost:8000/fridges/:fridgeID (e.g. http://localhost:8000/fridges/fg-1)

3.1.3       request : POST
            url     : http://localhost:8000/fridges
            body    :   
                        {
                            "name": "Test",
                            "can_accept_items": 10,
                            "accepted_types": [
                                "1",
                                "2"
                            ],
                            "contact_person": "Jonathan",
                            "contact_phone": "100000",
                            "address": {
                                "street": "testing street",
                                "postalCode": "1010101",
                                "city": "testing city",
                                "province": "testing province",
                                "country": "testing country"
                            }
                        }

3.1.4       request : PUT
            url     : http://localhost:8000/fridges/:fridgeID (e.g. http://localhost:8000/fridges/fg-1)
            body    :
                        {
                            "name" : "newName",
                            "numItemsAccepted": 10,
                            "contactInfo": {
                                "contactPerson": "newPerson",
                                "contactPhone": "newPhone"
                            },
                            "address": {
                                "street": "newStreet"
                            }
                        }

            note    : - unable to update multiple acceptedTypes 
                         i.e. able to update { "acceptedTypes": ["1"]}
                             but not { "acceptedTypes": ["1", "2"]}
                    
                      - unable to update multiple items 
                         i.e. able to update { "items": [{"id": "1", "quantity": 0}]}
                             but not { "items": [{"id": "1", "quantity": 0}, {"id": "2", "quantity": 10}]}

3.1.5       request : POST
            url     : http://localhost:8000/fridges/:fridgeID/items (e.g. http://localhost:8000/fridges/fg-1/items)
            body    :
                        {
                            "id": "1",
                            "quantity": 10
                        }

            note    : - only able to add one item per request
                        i.e. after sending { "id": "1", "quantity": 10 },
                             if you want to add another item, you have to send a new request with a different body { "id": "2","quantity": 20 }

3.1.6       request : DELETE
            url     : http://localhost:8000/fridges/:fridgeID/items/:itemID (e.g. http://localhost:8000/fridges/fg-1/items/2)
            body    : no body is needed in this request

3.1.7       request : DELETE
            url     : http://localhost:8000/fridges/:fridgeID/items?item=itemID (e.g. http://localhost:8000/fridges/fg-1/items?item=1&item=2)
            body    : no body is needed in this request
            params  : you can either set the params in the url or postman, just make sure the key is spelled item
            note    : - if you did not provide any params,
                        i.e. http://localhost:8000/fridges/:fridgeID/items
                        then all the items in the items array will be deleted

3.2.1       request : PUT
            url     : http://localhost:8000/fridges/:fridgeID/items/:itemID (e.g. http://localhost:8000/fridges/fg-1/items/2)
            body    :
                        {
                            "quantity": 10
                        }

3.2.2       request : POST
            url     : http://localhost:8000/items
            body    :
                        {
                            "name": "peanut butter",
                            "type": "1",
                            "img":"testingimg"
                        }

            note    : - the value of type must be the ID and cannot be the name
                        i.e. cannot do "type" : "dairy"

3.2.3       request : GET
            url     : http://localhost:8000/search/items?type=typeID&name=itemName (e.g. http://localhost:8000/search/items?type=1&name=milk)
            body    : no body is needed in this request
            params  : you can either set the params in the url or postman, just make sure the keys are spelled type and name
            note    :   - the value of the type must be the ID and cannot be the name of the type
                            i.e.    can do http://localhost:8000/search/items?type=2&name=grapes
                                    cannot do http://localhost:8000/search/items?type=pantry&name=grapes
                            
                            *in the bonus question, typing "dairy" in the search form will work

                        - you have to provide with both the type and name params, otherwise 400 code will be sent back



BONUS Mark: 

-   start the server by,
    node server.js
-   go to http://localhost:8000
-   all the files can be found in the public folder
-   all of the input fields have to be filled
-   the name input is not case-sensitive (e.g. can enter milk or Milk)
-   the type input is case-sensitive and has to be all lowercase (e.g. dairy, pantry, produce)

p.s. : Sorry for the late submission, i still have the full 96H of grace period. good luck with your finals
