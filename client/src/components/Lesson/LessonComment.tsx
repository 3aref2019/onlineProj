import { Comment, Image, Popconfirm, Spin, Tooltip } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteCommentAction } from "../../redux/slices/commentSlice";
import { Auth } from "../../redux/types";
import { formatDate, fromNow } from "../../utils/dayjsHelper";

interface Props {
  list: any[];
  auth: Auth;
  slug: string;
  identifier: string;
  status: boolean;
}
function PostComments({ list, auth, slug, identifier, status }: Props) {
  const dispatch = useDispatch();
  return (
    <>
      <label>Comments</label>
      <div>
        {status ? (
          <div className="flex items-center justify-center h-32 max-h">
            <Spin size="large" spinning />
          </div>
        ) : (
          list.map((c) => {
            return (
              <Comment
                author={c.username}
                key={c.id}
                avatar={`http://localhost:5000/uploads/profilepictures/${c.user.imageUrn}`}
                content={
                  <>
                    <p className="text-base">{c.body}</p>
                    {c.imageUrn && (
                      <Image
                        width={100}
                        src={`http://localhost:5000/uploads/${c.imageUrn}`}
                        preview={{
                          destroyOnClose: true,
                          getContainer: "#root",
                        }}
                      />
                    )}
                  </>
                }
                actions={[
                  <Tooltip
                    key="comment-basic-like"
                    title="make sure that this comment violate our rules"
                  >
                    <span>report</span>
                  </Tooltip>,
                  auth.isAuthenticated && auth.user.username === c.username && (
                    <span>
                      <Popconfirm
                        title="confirm"
                        okText="delete"
                        cancelText="cancel"
                        onConfirm={() => {
                          dispatch(
                            deleteCommentAction({
                              id: c.id,
                              slug,
                              identifier,
                            })
                          );
                        }}
                      >
                        <button>delete</button>
                      </Popconfirm>
                    </span>
                  ),
                ]}
                datetime={
                  <Tooltip title={formatDate(c.createdAt)}>
                    <span>{fromNow(c.createdAt)}</span>
                  </Tooltip>
                }
              />
            );
          })
        )}
      </div>
    </>
  );
}

export default PostComments;
