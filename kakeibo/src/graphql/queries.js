/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getKakeibo = /* GraphQL */ `
  query GetKakeibo($id: ID!) {
    getKakeibo(id: $id) {
      id
      price
      category
      shopName
      comment
      date
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listKakeibos = /* GraphQL */ `
  query ListKakeibos(
    $filter: ModelKakeiboFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKakeibos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        price
        category
        date
      }
      nextToken
    }
  }
`;
export const kakeiboByOwnerAndDate = /* GraphQL */ `
  query KakeiboByOwnerAndDate(
    $owner: String!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelKakeiboFilterInput
    $limit: Int
    $nextToken: String
  ) {
    kakeiboByOwnerAndDate(
      owner: $owner
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        price
        category
        shopName
        comment
        date
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
