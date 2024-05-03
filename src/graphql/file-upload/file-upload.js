import { gql } from '@apollo/client';

 
export const FILE_UPLOAD = gql`
  mutation Image_upload($file: Upload!, $type: String) {
    image_upload(file: $file, type: $type) 
  }
`;
 