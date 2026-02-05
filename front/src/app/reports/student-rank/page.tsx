import {query} from '../../../../lib/db';
import Link from 'next/link';
import {z} from 'zod';

const VALID_PROGRAMS = [ 'Matemáticas Avanzadas', 'Programación Orientada a Objetos'] as const;

