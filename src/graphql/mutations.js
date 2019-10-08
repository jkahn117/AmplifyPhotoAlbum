/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAlbum = `mutation CreateAlbum($input: CreateAlbumInput!) {
  createAlbum(input: $input) {
    id
    viewers
    owner
    ownerId
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
          viewers
          owner
          ownerId
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
        photoAlbumId
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
    viewers
    owner
    ownerId
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
          viewers
          owner
          ownerId
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
        photoAlbumId
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
    viewers
    owner
    ownerId
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
          viewers
          owner
          ownerId
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
        photoAlbumId
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
      viewers
      owner
      ownerId
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
          photoAlbumId
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
    photoAlbumId
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
      viewers
      owner
      ownerId
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
          photoAlbumId
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
    photoAlbumId
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
      viewers
      owner
      ownerId
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
          photoAlbumId
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
    photoAlbumId
    owner
  }
}
`;
