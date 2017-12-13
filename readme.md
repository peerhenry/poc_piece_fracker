# Piece Fracker POC
![demo](https://github.com/peerhenry/poc_piece_fracker/blob/master/demo.png)

This is a proof of concept for piece fracking. In this example the pieces are represented by red squares. Fracking refers to breaking a piece down into smaller pieces.

## Instruction

Simply open index.html and move the green dot with the arrow keys.

## Motivation

The aim of this technique is to improve performance of voxel games. On the one hand, chunks should be small so that model rebuilding due to voxel manipulation is fast. On the other, bigger and fewer models make better use of the GPU processing (models are drawn in sequence, data within models is drawn in GPU super parallel land). Because chunks are typically only manipulated in close range of the player, it is desirable to have small models within manipulation range of the player, while at the same time have them as big as possible outside that range.

There is also a level of detail (LOD) application. Because the size of a piece is related to the distance to player, big pieces could use lower render detail.