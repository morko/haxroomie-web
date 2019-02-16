/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
export default function EventFeedCard(props) {

  return (
    <div className="EventFeedCard Card">
      <Card color="dark">
        <CardHeader className="text-white">Event Feed</CardHeader>
        <CardBody className="bg-light">
          
        </CardBody>

      </Card>
    </div>
  );
}