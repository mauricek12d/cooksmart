'use client';

import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export const signInEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signUpEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
