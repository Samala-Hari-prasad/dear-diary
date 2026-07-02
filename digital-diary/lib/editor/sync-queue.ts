export interface SyncTask {
  id: string;
  version: number;
  execute(): Promise<void>;
}

export class SyncQueue {
  private activeTask: SyncTask | null = null;
  private pendingTask: SyncTask | null = null;

  async enqueue(task: SyncTask): Promise<void> {
    // Rule 2: Queued snapshots replace older queued snapshots. Only keep the latest.
    if (this.pendingTask && task.version <= this.pendingTask.version) {
      return; // Discard obsolete task versions
    }

    this.pendingTask = task;
    this.process();
  }

  private async process(): Promise<void> {
    // Rule 1: Only one active request is allowed at a time
    if (this.activeTask) {
      return;
    }

    const taskToRun = this.pendingTask;
    if (!taskToRun) {
      return;
    }

    // Set active task and clear pending slot
    this.activeTask = taskToRun;
    this.pendingTask = null;

    try {
      await taskToRun.execute();
    } catch (error) {
      // Propagation logic handles this inside the task execute callback
    } finally {
      this.activeTask = null;
      // Rule 3: Process the next queued snapshot after completion
      this.process();
    }
  }

  isSyncing(): boolean {
    return this.activeTask !== null;
  }

  isPending(): boolean {
    return this.pendingTask !== null;
  }
}
