/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createKakeibo = /* GraphQL */ `
  mutation CreateKakeibo(
    $input: CreateKakeiboInput!
    $condition: ModelKakeiboConditionInput
  ) {
    createKakeibo(input: $input, condition: $condition) {
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
export const updateKakeibo = /* GraphQL */ `
  mutation UpdateKakeibo(
    $input: UpdateKakeiboInput!
    $condition: ModelKakeiboConditionInput
  ) {
    updateKakeibo(input: $input, condition: $condition) {
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
export const deleteKakeibo = /* GraphQL */ `
  mutation DeleteKakeibo(
    $input: DeleteKakeiboInput!
    $condition: ModelKakeiboConditionInput
  ) {
    deleteKakeibo(input: $input, condition: $condition) {
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
