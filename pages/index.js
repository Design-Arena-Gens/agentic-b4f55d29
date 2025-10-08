import Head from 'next/head';
import ChessBoard from '../components/ChessBoard';

export default function Home() {
  return (
    <>
      <Head>
        <title>Chess Game</title>
        <meta name="description" content="Play chess online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ChessBoard />
    </>
  );
}
