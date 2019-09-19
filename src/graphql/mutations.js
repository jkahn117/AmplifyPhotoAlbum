/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    albums {
      items {
        id
        owner
        name
        createdAt
        updatedAt
        photos {
          nextToken
        }
      }
      nextToken
    }
  }
}
`;
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    username
    albums {
      items {
        id
        owner
        name
        createdAt
        updatedAt
        photos {
          nextToken
        }
      }
      nextToken
    }
  }
}
`;
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    id
    username
    albums {
      items {
        id
        owner
        name
        createdAt
        updatedAt
        photos {
          nextToken
        }
      }
      nextToken
    }
  }
}
`;
export const createAlbum = `mutation CreateAlbum($input: CreateAlbumInput!) {
  createAlbum(input: $input) {
    id
    owner
    name
    createdAt
    updatedAt
    photos {
      items {
        id
        createdAt
        updatedAt
        album {
          id
          owner
          name
          createdAt
          updatedAt
        }
        fullsize {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        contentType
        gps {
          latitude
          longitude
          altitude
        }
        height
        width
        owner
      }
      nextToken
    }
  }
}
`;
export const updateAlbum = `mutation UpdateAlbum($input: UpdateAlbumInput!) {
  updateAlbum(input: $input) {
    id
    owner
    name
    createdAt
    updatedAt
    photos {
      items {
        id
        createdAt
        updatedAt
        album {
          id
          owner
          name
          createdAt
          updatedAt
        }
        fullsize {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        contentType
        gps {
          latitude
          longitude
          altitude
        }
        height
        width
        owner
      }
      nextToken
    }
  }
}
`;
export const deleteAlbum = `mutation DeleteAlbum($input: DeleteAlbumInput!) {
  deleteAlbum(input: $input) {
    id
    owner
    name
    createdAt
    updatedAt
    photos {
      items {
        id
        createdAt
        updatedAt
        album {
          id
          owner
          name
          createdAt
          updatedAt
        }
        fullsize {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        contentType
        gps {
          latitude
          longitude
          altitude
        }
        height
        width
        owner
      }
      nextToken
    }
  }
}
`;
export const createPhoto = `mutation CreatePhoto($input: CreatePhotoInput!) {
  createPhoto(input: $input) {
    id
    createdAt
    updatedAt
    album {
      id
      owner
      name
      createdAt
      updatedAt
      photos {
        items {
          id
          createdAt
          updatedAt
          contentType
          height
          width
          owner
        }
        nextToken
      }
    }
    fullsize {
      region
      bucket
      key
    }
    thumbnail {
      region
      bucket
      key
    }
    contentType
    gps {
      latitude
      longitude
      altitude
    }
    height
    width
    owner
  }
}
`;
export const deletePhoto = `mutation DeletePhoto($input: DeletePhotoInput!) {
  deletePhoto(input: $input) {
    id
    createdAt
    updatedAt
    album {
      id
      owner
      name
      createdAt
      updatedAt
      photos {
        items {
          id
          createdAt
          updatedAt
          contentType
          height
          width
          owner
        }
        nextToken
      }
    }
    fullsize {
      region
      bucket
      key
    }
    thumbnail {
      region
      bucket
      key
    }
    contentType
    gps {
      latitude
      longitude
      altitude
    }
    height
    width
    owner
  }
}
`;
export const updatePhoto = `mutation UpdatePhoto($input: UpdatePhotoInput!) {
  updatePhoto(input: $input) {
    id
    createdAt
    updatedAt
    album {
      id
      owner
      name
      createdAt
      updatedAt
      photos {
        items {
          id
          createdAt
          updatedAt
          contentType
          height
          width
          owner
        }
        nextToken
      }
    }
    fullsize {
      region
      bucket
      key
    }
    thumbnail {
      region
      bucket
      key
    }
    contentType
    gps {
      latitude
      longitude
      altitude
    }
    height
    width
    owner
  }
}
`;
