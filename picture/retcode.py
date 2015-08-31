SuccessInfo = {'retcode':200, 'msg': 'Ok'}
NotExistError = {'retcode':10001, 'msg':'%s id(%d) does not exist'}

def format_error(error, args):
  error['msg'] = error['msg'] % args