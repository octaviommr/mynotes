/* 
  Set up models for backend responses and frontend objects.

  This highlights the importance of NOT cloning backend data models in the frontend. 

  Frontend models are usually different from backend ones because they have different concerns. A frontend model might
  include only some of the props of the backend model, since the rest might not be needed in the frontend. On the other 
  hand, a frontend model might contain some props that don't exist in the backend model, due to only being relevant for 
  UI logic.

  We should only pick the props we care about for the frontend, and then use those to build the actual frontend objects.
  Just as an example, here we're renaming the mongoose "_id" prop to just "id".
*/
export interface UserResponse {
  _id: string
  email: string
  name: string
}

export type User = Omit<UserResponse, "_id"> & { id: string }

export type UserCredentials = Pick<User, "email"> & { password: string }
export type UserSignUp = Omit<User, "id"> & Pick<UserCredentials, "password">
