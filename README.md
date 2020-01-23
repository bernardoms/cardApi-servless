# Fidel Coding Challenge

## About this challenge

This challenge focuses on RESTful asset linking and data management. It consists of 2 parts, plus an optional task.

If for some reason you are unable to complete this challenge it's absolutely fine. However, it would be expected that you are at least able to discuss the challenge with some of the Fidel staff.

## Context

As part of the FIDEL API, the Offers API platform allows to connect merchants with publishers via [offers](https://docs.fidel.uk/offers). In the [reference API](https://reference.fidel.uk/reference), there is information about one endpoint we have for linking an offer with a location.

Feel free to browse our docs to familiarise yourself with our current commercial offering.

Any questions you may have please contact us at backend-review@fidel.uk.

Try that the solution is deployable and testable (preferably on the AWS platform).

## Part I

Create three DynamoDB tables with the following simplified data:

---

Offers

```
[{
  name: "Super Duper Offer",
  id: "d9b1d9ff-543e-47c7-895f-87f71dcad91b",
  brandId: "692126c8-6e72-4ad7-8a73-25fc2f1f56e4",
  locationsTotal: 0
}]
```

---

Locations

```
[{
  id: "03665f6d-27e2-4e69-aa9b-5b39d03e5f59",
  address: "Address 1",
  clo: false
}, {
  id: "706ef281-e00f-4288-9a84-973aeb29636e",
  address: "Address 2",
  clo: false
}, {
  id: "1c7a27de-4bbd-4d63-a5ec-2eae5a0f1870",
  address: "Address 3",
  clo: false
}]
```

---

Publisher

```
[{
  id: "4ba40461-c59b-4fd7-9c1f-da3a541e3b6e",
  name: "Some publisher or another"
}]
```

### Questions

It would be great if you could be prepared to answer questions like:

1. Did you use DynamoDb before?
   - If no, how did you prepare for this task?
   - If yes, which patterns did you learn in the past that you used here?
2. How did you designed your tables? Why?
3. What are the pros and cons of Dynamodb for an API request like the one in this challenge?

### Part 2

Create a Lambda function with an API endpoint that allows to link a location to an offer. The lambda should also increase the counter in the offer and mark the location as part of the Offers API.

### Questions

It would be great if you could be prepared to answer questions like:

1. Have you used Functions as a Service (FaaS) like AWS Lambda in the past?
   - If no, how did you prepare for this task?
   - If yes, how did this task compare to what you did?
2. How do you tend to write tasks that have some forking element (parallel requests, series of async actions, async mapReduce patterns, etc.)

### Bonus part (optional)

Create a Lambda function that allows to link all the brand's locations to an offer.

### Questions

Even if you don't have the time to complete this part, it would be great if you could be prepared to answer questions like:

1. What challenges do you foresee/have experienced for this part?
