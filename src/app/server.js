// server.js

import React from 'react';
import {
  registerPlatformComponents,
  Iterator
} from "zambool";
import { 
  Thumbnail, BoxC, BoxIC,
  AddToCartButton, RemoveButton
} from "./client";

registerPlatformComponents({
  Iterator, Thumbnail, BoxC, BoxIC,
  AddToCartButton, RemoveButton
});