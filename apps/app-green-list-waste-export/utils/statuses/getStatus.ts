export const getStatus = (wasteCode, ewcCodes, nationalCode, description) => {
  let subTasksCompleted = 0;

  if (wasteCode !== undefined) {
    subTasksCompleted++;
  }

  if (ewcCodes.length > 0) {
    subTasksCompleted++;
  }

  if (nationalCode !== undefined) {
    subTasksCompleted++;
  }

  if (description !== undefined) {
    subTasksCompleted++;
  }

  if (subTasksCompleted === 0) return 'NotStarted';
  if (subTasksCompleted < 4) return 'Started';
  else return 'Complete';
};
