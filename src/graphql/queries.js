/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbum = `query GetAlbum($id: ID!) {
  getAlbum(id: $id) {
    id
    owner
    ownerId
    viewers
    name
    createdAt
    photos {
      items {
        id
        createdAt
        thumbnail {
          key
        }
        fullsize {
          key
        }
        gps {
          latitude
          longitude
        }
      }
      nextToken
    }
  }
}
`;
export const listAlbums = `query ListAlbums(
  $filter: ModelAlbumFilterInput
  $limit: Int
  $nextToken: String
) {
  listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getPhoto = `query GetPhoto($id: ID!) {
  getPhoto(id: $id) {
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
export const listPhotos = `query ListPhotos(
  $filter: ModelPhotoFilterInput
  $limit: Int
  $nextToken: String
) {
  listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        photos {
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
    nextToken
  }
}
`;
