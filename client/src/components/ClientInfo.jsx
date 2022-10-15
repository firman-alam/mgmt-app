import React from 'react';
import { FaEnvelope, FaPhone, FaIdBadge } from 'react-icons/fa';

const ClientInfo = ({ client }) => {
  return (
    <>
      <div className='mt-5'>Client Information</div>
      <ul className='list-group'>
        <li className='list-group-item'>
          <FaIdBadge /> {client.name}
        </li>
        <li className='list-group-item'>
          <FaEnvelope /> {client.email}
        </li>
        <li className='list-group-item'>
          <FaPhone /> {client.phone}
        </li>
      </ul>
    </>
  );
};

export default ClientInfo;
