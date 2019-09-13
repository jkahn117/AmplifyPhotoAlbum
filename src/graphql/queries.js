/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    albums {
      items {
        id
        createdBy
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
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      username
      albums {
        items {
          id
          createdBy
          name
          createdAt
          updatedAt
        }
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getAlbum = `query GetAlbum($id: ID!) {
  getAlbum(id: $id) {
    id
    createdBy
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
          createdBy
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
export const listAlbums = `query ListAlbums(
  $filter: ModelAlbumFilterInput
  $limit: Int
  $nextToken: String
) {
  listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdBy
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
      createdBy
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
        createdBy
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
      owner
    }
    nextToken
  }
}
`;
