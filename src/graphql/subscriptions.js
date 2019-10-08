/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbum = `subscription OnCreateAlbum($owner: String!) {
  onCreateAlbum(owner: $owner) {
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
        owner
      }
      nextToken
    }
  }
}
`;
export const onUpdateAlbum = `subscription OnUpdateAlbum($owner: String!) {
  onUpdateAlbum(owner: $owner) {
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
        owner
      }
      nextToken
    }
  }
}
`;
export const onDeleteAlbum = `subscription OnDeleteAlbum($owner: String!) {
  onDeleteAlbum(owner: $owner) {
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
        owner
      }
      nextToken
    }
  }
}
`;
export const onCreatePhoto = `subscription OnCreatePhoto($owner: String!) {
  onCreatePhoto(owner: $owner) {
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
export const onDeletePhoto = `subscription OnDeletePhoto($owner: String!) {
  onDeletePhoto(owner: $owner) {
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
export const onUpdatePhoto = `subscription OnUpdatePhoto($owner: String!) {
  onUpdatePhoto(owner: $owner) {
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
