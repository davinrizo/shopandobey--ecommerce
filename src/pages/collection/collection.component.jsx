import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import CollectionItem from '../../components/collection-item/collection-item.component';

import { selectCollection } from '../../redux/shop/shop.selectors';

import {
  CollectionPageContainer,
  CollectionTitle,
  CollectionItemsContainer
} from './collection.styles';

export const CollectionPage = ({ collection }) => {
  const { title, items } = collection;
  return (
    <CollectionPageContainer>
      <CollectionTitle>{title}</CollectionTitle>
      <CollectionItemsContainer>
        {items.map(item => (
          <CollectionItem key={item.id} item={item} />
        ))}
      </CollectionItemsContainer>
    </CollectionPageContainer>
  );
};

const CollectionPageWrapper = (props) => {
  const { collectionId } = useParams();
  return <CollectionPage {...props} collectionId={collectionId} />;
};

const mapStateToProps = (state, ownProps) => ({
  collection: selectCollection(ownProps.collectionId)(state)
});

export default connect(mapStateToProps)(CollectionPageWrapper);
