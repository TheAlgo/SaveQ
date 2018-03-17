FROM ipfs/go-ipfs
COPY ./start-ipfs.sh /start-ipfs.sh
ENTRYPOINT sh /start-ipfs.sh